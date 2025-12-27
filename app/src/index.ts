import { TelegramBot } from "./shared/services/telegram-bot";
import { Scheme } from "./shared/services/scheme";

import type { Strapi } from "./shared/types/global";

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Strapi }) {
    strapi.bot = await TelegramBot.setup();
    strapi.bot.start();

    strapi.scheme = new Scheme();
    await strapi.scheme.setAll();
  },

  destroy({ strapi }: { strapi: Strapi }) {
    strapi.bot.stop();
    strapi.scheme.clear();
  },
};
