import Handlebars from "handlebars";
import { factories } from "@strapi/strapi";

import type { Strapi } from "../../../shared/types/global.ts";

export default factories.createCoreController(
  "api::template.template",
  ({ strapi }) => ({
    /**
     * Отправляет сообщение в Telegram на основе HTML-шаблона
     * - получает шаблон и токен из ctx.state
     * - рендерит Handlebars-шаблон данными
     * - рассылает сообщение всем связанным Telegram-пользователям
     */
    async sendMessage(ctx) {
      /** Инстанс Telegram-бота */
      const bot = (strapi as Strapi).bot;

      /** documentId шаблона из middleware */
      const templateId = ctx.state.templateId;

      /** documentId токена из middleware */
      const tokenId = ctx.state.tokenId;

      /** Валидированные данные для шаблона */
      const data = ctx.state.data;

      /** Параллельная загрузка шаблона и токена */
      const [template, token] = await Promise.all([
        strapi.documents("api::template.template").findOne({
          documentId: templateId,
          fields: ["html"],
        }),
        strapi.documents("api::token.token").findOne({
          documentId: tokenId,
          populate: {
            telegram_users: true,
          },
        }),
      ]);

      /** Компиляция Handlebars-шаблона */
      const handlebarsTemplate = Handlebars.compile(template.html);

      /** Генерация итогового сообщения */
      const message = handlebarsTemplate(data);

      /** Отправка сообщения всем Telegram-пользователям токена */
      await Promise.allSettled(
        token.telegram_users.map((user) =>
          bot.api.sendMessage(user.userId, message, {
            parse_mode: "HTML",
          }),
        ),
      );

      /** Успешный ответ */
      return {
        success: true,
      };
    },
  }),
);
