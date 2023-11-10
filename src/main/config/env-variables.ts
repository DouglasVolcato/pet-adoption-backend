import * as dotenv from "dotenv";

export const EnvVars = {
  MONGO_DB_URL: function (): string {
    this.config();
    return process.env.MONGO_DB_URL || "";
  },

  SECRET: function (): string {
    this.config();
    return process.env.SECRET || "384f83ny48yr384yr8";
  },

  PORT: function (): string {
    this.config();
    return process.env.PORT || "7777";
  },

  CATS_API_TOKEN: function (): string {
    this.config();
    return process.env.CATS_API_TOKEN || "";
  },

  DOGS_API_TOKEN: function (): string {
    this.config();
    return process.env.DOGS_API_TOKEN || "";
  },

  config: function (): void {
    try {
      dotenv.config();
    } catch (error) {}
  },
};
