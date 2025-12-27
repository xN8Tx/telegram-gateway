import { randomBytes } from "node:crypto";

export default {
  /**
   * Lifecycle-хук перед созданием токена
   * - автоматически генерирует токен, если он не передан
   */
  beforeCreate(event: any) {
    /** Проверка наличия токена */
    if (!event.params.data.token) {
      /** Генерация случайного токена и преобразование в hex */
      event.params.data.token = Buffer.from(randomBytes(128)).toString("hex");
    }
  },
};
