import type { Core } from "@strapi/strapi";
import type { Context } from "koa";

export default (_: unknown, { strapi }: { strapi: Core.Strapi }) => {
  /**
   * Middleware авторизации по app-token
   * - проверяет наличие токена в заголовках
   * - находит приложение по токену
   * - проверяет доступ к шаблону по type
   * - сохраняет templateId и tokenId в ctx.state
   */
  return async (ctx: Context, next: any) => {
    /** Заголовки запроса */
    const headers = ctx.request.headers;

    /** Токен приложения из заголовка */
    const token = headers?.["app-token"];

    /** Проверка наличия и корректности токена */
    if (!token || typeof token !== "string") {
      ctx.unauthorized();
      return;
    }

    /** Поиск приложения по токену */
    const apps = await strapi.documents("api::token.token").findMany({
      filters: {
        token: token,
      },
      populate: {
        templates: true,
      },
    });

    /** Если приложение не найдено */
    if (!apps.length) {
      ctx.unauthorized();
      return;
    }

    /** Найденное приложение */
    const app = apps[0];

    /** Тип шаблона из тела запроса */
    const type = ctx.request.body?.type;

    /** Проверка наличия типа шаблона */
    if (!type) {
      ctx.unauthorized();
      return;
    }

    /** Поиск шаблона, доступного данному приложению */
    const selectedTemplate = app.templates.find(
      (template) => template.key === type,
    );

    /** Если шаблон не найден или недоступен */
    if (!selectedTemplate) {
      ctx.unauthorized();
    }

    /** Сохранение documentId шаблона в state */
    ctx.state.templateId = selectedTemplate.documentId;

    /** Сохранение documentId токена в state */
    ctx.state.tokenId = app.documentId;

    /** Переход к следующему middleware */
    return next();
  };
};
