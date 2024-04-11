import loaders from "./loaders";
import express, { Application } from "express";
import { logger } from "./shareds/utils/logger";

export async function main() {
  const app: Application = express();

  await loaders(app);

  process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received.');
    logger.info('Closing database connection.');
  });
}

main();
