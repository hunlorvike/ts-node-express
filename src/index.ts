import loaders from "./loaders";
import express, { Application } from "express";


export async function main() {
  const app: Application = express();

  await loaders(app);

  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received.');
    console.log('Express app closed.');
    process.exit(0);
  });
}

main();


