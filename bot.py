import os
import logging
import random
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


async def ask_ai(question: str) -> str:
    import openai

    openai.api_key = OPENAI_API_KEY
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are Foreigner.uz AI Assistant. Always detect the user's language and respond in the EXACT same language (English, Russian,Uzbek or 中文). Keep answers helpful and clear."
                },
                {
                    "role": "user",
                    "content": question
                }
            ],
            temperature=0.7,
            max_tokens=250,
        )
        return response.choices[0].message.content.strip()
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
    # Debug logging for incoming messages
    logger.info("Incoming message: chat_id=%s user_id=%s username=%s text=%s",
                message.chat_id if message else None,
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
            # Answer with AI if user asked a question or wants advice
            ai_response = await ask_ai(user_text)
            await message.reply_text(ai_response)
            return

        forwarded = await context.bot.forward_message(
            chat_id=OWNER_ID,
            from_chat_id=message.chat_id,
            message_id=message.message_id,
        )
        # store mapping so owner replies can be routed back to the original user
        try:
            forwarded_map[forwarded.message_id] = user.id
        except Exception:
            logger.exception("Failed to store forwarded mapping")
        # update last forwarded user for fallback replies
        try:
            last_forwarded_user = user.id
        except Exception:
            logger.exception("Failed to set last_forwarded_user")

        sender_info = format_user(user)
        info_msg = await context.bot.send_message(
            chat_id=OWNER_ID,
            text=(
                f"Новое сообщение от {sender_info}\n"
                f"user_id: {user.id}\n"
                "Ответь на это пересланное сообщение, чтобы отправить ответ клиенту."
            ),
            reply_to_message_id=forwarded.message_id,
        )
        # also map the informational message id so owner can reply to it
        try:
            forwarded_map[info_msg.message_id] = user.id
        except Exception:
            logger.exception("Failed to store mapping for info message")
        await message.reply_text(
            "Спасибо! Ваше сообщение доставлено. Мы ответим вам в ближайшее время."
        )


async def error_handler(update: object, context: ContextTypes.DEFAULT_TYPE):
    logger.error("Ошибка в обработчике: %s", context.error)


def main():
    app = ApplicationBuilder().token(BOT_TOKEN).build()
    logger.info("Configured OWNER_ID=%s", OWNER_ID)

    app.add_handler(CommandHandler("start", start_command))
    app.add_handler(CommandHandler("mappings", mappings_command))
    app.add_handler(CommandHandler("last", last_command))
    app.add_handler(CommandHandler("debug", lambda update, context: debug_command_handler(update, context)))
    app.add_handler(
        MessageHandler((filters.ALL & ~filters.COMMAND), handle_user_message)
    )
    app.add_error_handler(error_handler)

    logger.info("Запуск бота")
    app.run_polling()


if __name__ == "__main__":
    main()
