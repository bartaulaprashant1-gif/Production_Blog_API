/**
  * @copyright 2026 Prashant Bartaula
  * @license Apache-2.0
 */

import dotenv from "dotenv";

dotenv.config();

const config={
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  WHITELIST_ORIGINS:['https://docs.blog-api.codewithsadee.com']
}

export default config;