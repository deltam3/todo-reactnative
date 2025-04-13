import { config } from "dotenv";
import { resolve } from "path";
import type { ExpoConfig } from "@expo/config-types";

// Load the correct .env file depending on NODE_ENV
const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";

config({ path: resolve(__dirname, envFile) });

// Export a typed config object
const expoConfig: ExpoConfig = {
  name: "MyApp",
  slug: "myapp",
  version: "1.0.0",
  extra: {
    API_URL: process.env.API_URL || "http://localhost:3000",
    APP_NAME: "MyApp",
  },
  android: {
    package: "com.expoisgood.myapp",
  },
  ios: {
    bundleIdentifier: "com.expoisgood.myapp",
  },
};

export default expoConfig;
