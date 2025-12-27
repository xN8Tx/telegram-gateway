import { Bot } from "grammy";

export class TelegramBot {
  /**
   * Инициализация и настройка Telegram-бота
   * - регистрирует команды
   * - навешивает обработчики
   * - возвращает готовый инстанс бота
   */
  public static async setup() {
    /** Создание инстанса бота с токеном из env */
    const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);

    /** Регистрация команд бота в Telegram */
    await bot.api.setMyCommands([
      {
        /** Команда запуска бота */
        command: "start",
        description: "Запустить бота",
      },
      {
        /** Команда получения Telegram user ID */
        command: "id",
        description: "Показать мой Telegram ID",
      },
    ]);

    /** Обработчик команды /start */
    bot.command("start", async (ctx) => {
      await ctx.reply(`👋 Привет!\n\n` + `🆔 Твой user ID: ${ctx.from?.id}\n`);
    });

    /** Обработчик команды /id */
    bot.command("id", async (ctx) => {
      await ctx.reply(`🆔 Твой user ID: ${ctx.from?.id}\n`);
    });

    /** Возвращаем настроенный инстанс бота */
    return bot;
  }
}
