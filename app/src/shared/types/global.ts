import type { Core } from "@strapi/strapi";
import type { Api, Bot, Context, RawApi } from "grammy";
import { Scheme } from "../services/scheme";

export type Strapi = Core.Strapi & {
  bot: Bot<Context, Api<RawApi>>;
  scheme: Scheme;
};
