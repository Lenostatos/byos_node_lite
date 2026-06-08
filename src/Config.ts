import * as path from "node:path";
import { ROUTE_IMAGE } from "./Routes.js";
import * as process from "node:process";

export const SERVER_PORT: number = Number.parseInt(
  readEnvOrFail("SERVER_PORT"),
);
export const SERVER_HOST = readEnvOrFail("SERVER_HOST");
export const REFRESH_RATE_SECONDS: number = Number.parseInt(
  readEnvOrFail("REFRESH_RATE_SECONDS"),
);
export const TIMEZONE = readEnvOrFail("TIMEZONE");
export const ALLOW_FIRMWARE_UPDATE: boolean =
  readEnvOrFail("ALLOW_FIRMWARE_UPDATE") === "true";
export const BUTTON_2_CLICK_FUNCTION = readEnvOrFail("BUTTON_2_CLICK_FUNCTION"); // https://help.usetrmnl.com/en/articles/9672080-special-functions
export let BYOS_ENABLED: boolean = readEnvOrFail("BYOS_ENABLED") === "true";
export let BYOS_PROXY: boolean = readEnvOrFail("BYOS_PROXY") === "true";

// ----- Calculated constants below
export const SECRET_KEY = readEnvOrFail("SECRET_KEY");
export const PUBLIC_URL_ORIGIN = readEnvOrFail("PUBLIC_URL_ORIGIN");
export const IS_TEST_ENV = mayReadEnv("TEST") === "true";
export const SCREEN_URL =
  PUBLIC_URL_ORIGIN + ROUTE_IMAGE + "?secret_key=" + SECRET_KEY;
export const ASSETS_FOLDER = path.join(import.meta.dirname, "..", "assets");
export const TEMPLATE_FOLDER = path.join(import.meta.dirname, "/", "Template");
export const BYOS_DEVICE_MAC = mayReadEnv("BYOS_DEVICE_MAC");
export const BYOS_DEVICE_ACCESS_TOKEN = mayReadEnv("BYOS_DEVICE_ACCESS_TOKEN");

if (IS_TEST_ENV) {
  BYOS_ENABLED = true;
  BYOS_PROXY = true;
}

function mayReadEnv(key: string): string | undefined {
  const value = process.env[key];
  if (value === undefined || value.length < 2) {
    return undefined;
  }
  return value;
}

function readEnvOrFail(key: string): string {
  const value = process.env[key];
  if (value === undefined) {
    throw new Error(`Environment variable "${key}" is not set`);
  }
  return value;
}
