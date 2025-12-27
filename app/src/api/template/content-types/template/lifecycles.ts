import { Strapi } from "../../../../shared/types/global";

export default {
  /**
   * Lifecycle-хук перед созданием шаблона
   * - генерирует и сохраняет Zod-схему для нового шаблона
   */
  beforeCreate(event: any) {
    /** Генерация схемы по documentId создаваемого шаблона */
    (strapi as Strapi).scheme.set(event.params.data.documentId);
  },
};
