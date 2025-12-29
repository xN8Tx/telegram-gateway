import { Core } from "@strapi/strapi";
import { z } from "zod";

/** Поддерживаемые типы полей, приходящие из шаблона */
type FieldType =
  | "string"
  | "number"
  | "stringArray"
  | "numberArray"
  | "boolean";

/** Базовые Zod-схемы для одного поля */
type BaseFieldSchema =
  | z.ZodString
  | z.ZodNumber
  | z.ZodArray<z.ZodString>
  | z.ZodArray<z.ZodNumber>
  | z.ZodBoolean;

/** Схема поля с возможной optional-оберткой */
type FieldSchema = BaseFieldSchema | z.ZodOptional<BaseFieldSchema>;

/** Конфигурация поля, приходящая из Strapi */
interface FieldConfig {
  /** Уникальный идентификатор поля */
  id: unknown;

  /** Ключ поля в итоговом объекте */
  name?: string;

  /** Флаг обязательности поля */
  isRequired?: boolean;

  /** Тип значения поля */
  type?: FieldType;
}

/** Маппинг FieldType → Zod-схема */
const typeMap: Record<FieldType, () => BaseFieldSchema> = {
  string: () => z.string(),
  number: () => z.number(),
  stringArray: () => z.array(z.string()),
  numberArray: () => z.array(z.number()),
  boolean: () => z.boolean(),
};

export class Scheme {
  /** Хранилище Zod-схем по documentId шаблона */
  private schemes = new Map<string, z.ZodObject<Record<string, FieldSchema>>>();

  /**
   * Генерирует Zod-схему для одного поля
   * @param field Конфигурация поля
   */
  private generateZodField(field: FieldConfig): FieldSchema | null {
    /** Если тип поля не задан — схему создать невозможно */
    if (!field.type) {
      return null;
    }

    /** Базовая схема по типу */
    let schema = typeMap[field.type]();

    /** Если поле не обязательное — делаем optional */
    if (field.isRequired === false) {
      schema = schema.optional() as any;
    }

    return schema;
  }

  /**
   * Генерирует Zod-схему для всего шаблона
   * @param fields Список полей шаблона
   */
  private generateZodSchema(
    fields: FieldConfig[],
  ): z.ZodObject<Record<string, FieldSchema>> {
    /** Защита от пустого списка полей */
    if (!fields || fields.length === 0) {
      strapi.log.error("Fields array is empty");
      return z.object({});
    }

    /** Shape для Zod.object */
    const shape: Record<string, FieldSchema> = {};

    for (const field of fields) {
      /** Поле без имени пропускается */
      if (!field.name) {
        strapi.log.warn("Field without name skipped", field.id);
        continue;
      }

      /** Генерация схемы поля */
      const fieldSchema = this.generateZodField(field);
      if (!fieldSchema) continue;

      /** Добавление поля в shape */
      shape[field.name] = fieldSchema;
    }

    return z.object(shape);
  }

  /**
   * Создаёт и сохраняет схему для одного шаблона
   * @param templateDocumentId documentId шаблона
   */
  public async set(templateDocumentId: string): Promise<void> {
    const template = await strapi.documents("api::template.template").findOne({
      documentId: templateDocumentId,
      populate: { fields: true },
    });

    /** Если шаблон не найден */
    if (!template) {
      strapi.log.error("Template not found", templateDocumentId);
      return;
    }

    const schema = this.generateZodSchema(template.fields);
    this.schemes.set(templateDocumentId, schema);
  }

  /**
   * Создаёт и сохраняет схемы для всех шаблонов
   */
  public async setAll(): Promise<void> {
    const templates = await strapi
      .documents("api::template.template")
      .findMany({
        populate: { fields: true },
        pageSize: 99999,
      });

    /** Если шаблоны отсутствуют */
    if (!templates.length) {
      strapi.log.warn("Templates list is empty");
      return;
    }

    for (const template of templates) {
      const schema = this.generateZodSchema(template.fields);
      this.schemes.set(template.documentId, schema);
    }
  }

  /**
   * Возвращает Zod-схему по documentId шаблона
   */
  public get(templateDocumentId: string) {
    return this.schemes.get(templateDocumentId);
  }

  /**
   * Удаляет схему шаблона
   */
  public delete(templateDocumentId: string) {
    this.schemes.delete(templateDocumentId);
  }

  /**
   * Полностью очищает хранилище схем
   */
  public clear() {
    this.schemes.clear();
  }
}
