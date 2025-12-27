import type { Core } from "@strapi/strapi";
import type { Context } from "koa";
import type { Strapi } from "../../../shared/types/global";
import z from "zod";

export default (_: unknown, { strapi }: { strapi: Core.Strapi }) => {
  /**
   * Middleware валидации payload по динамической Zod-схеме шаблона
   */
  return async (ctx: Context, next: () => Promise<void>) => {
    /** Данные запроса */
    const data = ctx.request.body?.data;

    /** documentId шаблона, сохранённый в state на предыдущем шаге */
    const templateDocumentId = ctx.state?.templateId;

    /** Сервис работы со схемами */
    const schemeService = (strapi as Strapi).scheme;

    /** Zod-схема для текущего шаблона */
    const templateScheme = schemeService.get(templateDocumentId);

    /** Если схема шаблона не найдена */
    if (!templateScheme) {
      return ctx.notFound("Template schema not found");
    }

    /** Строгая схема (запрещает неизвестные поля) */
    const strictSchema = templateScheme.strict();

    /** Валидация payload */
    const result = strictSchema.safeParse(data);

    /** Обработка ошибок валидации */
    if (!result.success) {
      return ctx.badRequest("Payload validation failed", {
        error: z.prettifyError(result.error),
      });
    }

    /** Сохранение валидированных данных в state */
    ctx.state.data = result.data;

    /** Переход к следующему middleware */
    await next();
  };
};
