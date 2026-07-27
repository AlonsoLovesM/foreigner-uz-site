import logging
import os

from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, MessageHandler, filters, ContextTypes

BOT_TOKEN = os.environ.get("BOT_TOKEN")
OWNER_ID = os.environ.get("OWNER_ID")

if not BOT_TOKEN:
    raise RuntimeError("Set BOT_TOKEN environment variable with your Telegram bot token.")
if not OWNER_ID:
    raise RuntimeError("Set OWNER_ID environment variable with your Telegram user id.")

OWNER_ID = int(OWNER_ID)

logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO,
)
logger = logging.getLogger(__name__)

# In-memory map: forwarded_message_id (in owner chat) -> original_user_id
forwarded_map = {}

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


async def handle_user_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
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
            await message.reply_text(
                "Чтобы ответить клиенту, ответь на пересланное сообщение пользователя в этом чате."
            )
    else:
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

        sender_info = format_user(user)
        await context.bot.send_message(
            chat_id=OWNER_ID,
            text=(
                f"Новое сообщение от {sender_info}\n"
                f"user_id: {user.id}\n"
                "Ответь на это пересланное сообщение, чтобы отправить ответ клиенту."
            ),
            reply_to_message_id=forwarded.message_id,
        )
        await message.reply_text(
            "Спасибо! Ваше сообщение доставлено. Мы ответим вам в ближайшее время."
        )


async def error_handler(update: object, context: ContextTypes.DEFAULT_TYPE):
    logger.error("Ошибка в обработчике: %s", context.error)


def main():
    app = ApplicationBuilder().token(BOT_TOKEN).build()

    app.add_handler(CommandHandler("start", start_command))
    app.add_handler(
        MessageHandler((filters.ALL & ~filters.COMMAND), handle_user_message)
    )
    app.add_error_handler(error_handler)

    logger.info("Запуск бота")
    app.run_polling()


if __name__ == "__main__":
    main()
