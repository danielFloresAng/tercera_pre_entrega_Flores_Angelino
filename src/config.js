import * as url from "url";
import { Command } from "commander";
import dotenv from "dotenv";

const program = new Command();

program.option("--mode <mode>").option("--port <port>");

program.parse();

const programOpts = program.opts();
// dotenv.config();
dotenv.config({
  path: programOpts.mode === ".env.prod" ? ".env.prod" : ".env.devel",
});

const config = {
  PORT: programOpts.port || 8000,
  SERVER: 'Local',
  DIRNAME: url.fileURLToPath(new URL(".", import.meta.url)),
  get UPLOAD_DIR() {
    return `${this.DIRNAME}/public/img`;
  },
  MONGODB_URI:
    "mongodb+srv://danns1125:E-commerce@e-commerce-coder.ksbwadq.mongodb.net/ecommerce",
  MONGODB_ID_REGEX: /^[a-fA-F0-9]{24}$/,
  SECRET: process.env.SECRET,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL,
};

export default config;
