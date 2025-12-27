import type { Core } from "@strapi/strapi";

const config: Core.RouterConfig = {
  type: "content-api",
  routes: [
    {
      method: "POST",
      path: "/send",
      handler: "api::template.template.sendMessage",
      config: {
        middlewares: ["api::template.app-token", "api::template.data-validate"],
      },
    },
  ],
};

export default config;
