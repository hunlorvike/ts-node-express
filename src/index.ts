import { createExpressServer } from 'routing-controllers';
import { type Express } from 'express';
import * as swaggerUiExpress from 'swagger-ui-express';
import { Server } from './server';
import { logger } from './shareds/utils/logger';
import { spec } from './shareds/configs/swagger.config';
import { routingControllersOptions } from './shareds/configs/app.config';

export function main() {
  const app: Express = createExpressServer(routingControllersOptions);

  app.use('/swagger.html', swaggerUiExpress.serve, swaggerUiExpress.setup(spec));

  Server.init(app);

  process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received.');
    logger.info('Closing database connection.');
  });
}

main();
