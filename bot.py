import os
import logging
import json
import socket
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError
from dotenv import load_dotenv

load_dotenv()

from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, MessageHandler, filters, ContextTypes

BOT_TOKEN = os.environ.get("BOT_TOKEN")
OWNER_ID = os.environ.get("OWNER_ID")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

if not BOT_TOKEN:
    raise RuntimeError("Set BOT_TOKEN environment variable with your Telegram bot token.")
if not OWNER_ID:
    raise RuntimeError("Set OWNER_ID environment variable with your Telegram user id.")

OWNER_ID = int(OWNER_ID)

if not OPENAI_API_KEY:
    raise RuntimeError("Set OPENAI_API_KEY environment variable with your OpenAI API key.")

logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO,
)
logger = logging.getLogger(__name__)

# In-memory map: forwarded_message_id (in owner chat) -> original_user_id
forwarded_map = {}
# store most recent forwarded user id so owner can reply without using Reply
last_forwarded_user = None

def format_user(user):
    if user.username:
        return f"@{user.username} ({user.first_name} {user.last_name or ''})"
    return f"{user.first_name} {user.last_name or ''}".strip()


async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if update.effective_user.id == OWNER_ID:
        await update.message.reply_text(
            "Бот запущен. Перешли мне сообщение клиента или ответь на пересланное сообщение, чтобы отправить ответ клиенту."
        )
    else:
        await update.message.reply_text(
            "Привет! Ваше сообщение получено. Скоро с вами свяжется оператор."
        )


def format_ai_prompt(user_text: str) -> str:
    return (
        "Ты виртуальный гид и помощник туриста в Ташкенте (Foreigner.uz).\n"
        "Определи язык пользователя и отвечай СТРОГО на том же языке (English, Русский, O'zbekcha,中文).\n"
        f"Вопрос пользователя: {user_text}"
    )


def should_forward_to_owner(text: str) -> bool:
    normalized = text.lower()
    human_keywords = [
        "оператор", "человек", "human", "live", "agent", "связаться", "с человеком",
        "переведи", "передай", "talk to", "call me", "call me back"
    ]
    return any(keyword in normalized for keyword in human_keywords)


def should_answer_owner_contact(text: str) -> bool:
    normalized = text.lower()
    contact_keywords = [
        "контакт", "контакты", "номер", "phone", "telegram", "tg", "связаться", "кому писать",
        "owner", "владелец", "who is owner", "мой контакт", "мои контакты", "как связаться"
    ]
    return any(keyword in normalized for keyword in contact_keywords)


async def ask_ai(question: str) -> str:
    if not OPENAI_API_KEY:
        logger.error("OPENAI_API_KEY is not configured")
        return "ИИ временно недоступен: не настроен API key."

    try:
        payload = {
            "model": "gpt-4o-mini",
            "messages": [
                {
                    "role": "system",
                    "content": "You are Foreigner.uz AI Assistant. Always detect the user's language and respond in the EXACT same language (English, Russian, Uzbek or 中文). Keep answers helpful and clear."
                },
                {
                    "role": "user",
                    "content": question
                }
            ],
            "temperature": 0.7,
            "max_tokens": 250,
        }

        req = Request(
            "https://api.openai.com/v1/chat/completions",
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {OPENAI_API_KEY}",
                "Content-Type": "application/json",
            },
            method="POST",
        )

        with urlopen(req, timeout=20) as response:
            data = json.loads(response.read().decode("utf-8"))

        content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
        if isinstance(content, str) and content.strip():
            return content.strip()
        return "Извините, ИИ не вернул ответ. Попробуйте ещё раз."
    except HTTPError as exc:
        error_text = exc.read().decode("utf-8", errors="ignore")
        logger.error("OpenAI HTTP error: %s", error_text)
        return "ИИ временно недоступен. Проверьте API ключ и лимиты."
    except URLError as exc:
        logger.error("OpenAI network error: %s", exc)
        return "ИИ временно недоступен: проблема с сетью или доступом к OpenAI."
    except socket.timeout as exc:
        logger.error("OpenAI timeout: %s", exc)
        return "ИИ временно недоступен: запрос занял слишком много времени."
    except Exception as exc:
        logger.error("OpenAI request failed: %s", exc)
        return "Извините, сейчас временно недоступна помощь через ИИ. Попробуйте позже."

async def mappings_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    # Owner-only command to view current forwarded_map for debugging
    if update.effective_user.id != OWNER_ID:
        await update.message.reply_text("Нет доступа")
        return
    if not forwarded_map:
        await update.message.reply_text("No mappings stored")
        return
    lines = [f"{k} -> {v}" for k, v in list(forwarded_map.items())[:50]]
    await update.message.reply_text("\n".join(lines))


async def last_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if update.effective_user.id != OWNER_ID:
        await update.message.reply_text("Нет доступа")
        return
    if last_forwarded_user:
        await update.message.reply_text(f"Last forwarded user_id: {last_forwarded_user}")
    else:
        await update.message.reply_text("No last forwarded user stored")


async def debug_command_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    uid = update.effective_user.id if update.effective_user else None
    await update.message.reply_text(f"Your user_id: {uid}. Configured OWNER_ID: {OWNER_ID}")


async def handle_user_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    global last_forwarded_user
    message = update.message
    user = update.effective_user
    if not message:
        return

    logger.info("Incoming message: chat_id=%s user_id=%s username=%s text=%s",
                message.chat_id,
                user.id if user else None,
                getattr(user, 'username', None),
                message.text if message and message.text else None)

    if user.id == OWNER_ID:
        # Owner writing to bot directly
        if message.reply_to_message:
            # Owner replied to a forwarded message — find original user id
            replied_id = message.reply_to_message.message_id
            logger.info("Owner replied: reply_msg_id=%s replied_to_id=%s text=%s",
                        message.message_id,
                        replied_id,
                        message.text if message.text else None)
            target_id = forwarded_map.get(replied_id)
            text = message.text or ""
            if not text.strip():
                await message.reply_text("Ответ должен содержать текст.")
                return
            if target_id:
                await context.bot.send_message(chat_id=target_id, text=text)
                await message.reply_text(f"Ответ отправлен клиенту (user_id: {target_id}).")
            else:
                # Fallback: try to use forward_from if available
                if message.reply_to_message.forward_from:
                    target = message.reply_to_message.forward_from
                    await context.bot.send_message(chat_id=target.id, text=text)
                    await message.reply_text(f"Ответ отправлен клиенту {format_user(target)}.")
                else:
                    await message.reply_text(
                        "Не удалось найти пользователя для ответа. Перешли сообщение ещё раз.")
        else:
            # fallback: if owner didn't use reply, send to last forwarded user
            if last_forwarded_user:
                text = message.text or ""
                if not text.strip():
                    await message.reply_text("Ответ должен содержать текст.")
                else:
                    await context.bot.send_message(chat_id=last_forwarded_user, text=text)
                    await message.reply_text(f"Ответ отправлен клиенту (user_id: {last_forwarded_user}).")
            else:
                await message.reply_text(
                    "Чтобы ответить клиенту, ответь на пересланное сообщение пользователя в этом чате."
                )
    else:
        user_text = message.text or ""
        if user_text.strip():
            if should_answer_owner_contact(user_text):
                await message.reply_text("Связаться с владельцем можно через Telegram: @acapelonso")
                return

            ai_response = await ask_ai(user_text)
            await message.reply_text(ai_response)
            return

        await message.reply_text("Напишите ваш вопрос, и я помогу.")


async def error_handler(update: object, context: ContextTypes.DEFAULT_TYPE):
    logger.exception("Ошибка в обработчике: %s", context.error)


def main():
    logger.info("Configured OWNER_ID=%s", OWNER_ID)
    app = ApplicationBuilder().token(BOT_TOKEN).build()

    app.add_handler(CommandHandler("start", start_command))
    app.add_handler(CommandHandler("mappings", mappings_command))
    app.add_handler(CommandHandler("last", last_command))
    app.add_handler(CommandHandler("debug", lambda update, context: debug_command_handler(update, context)))
    app.add_handler(MessageHandler(filters.ALL & ~filters.COMMAND, handle_user_message))
    app.add_error_handler(error_handler)

    logger.info("Запуск бота")
    app.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == "__main__":
    main()
