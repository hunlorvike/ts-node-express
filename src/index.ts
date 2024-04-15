import { createExpressServer } from 'routing-controllers';
import loaders from './loaders';
import { routingControllersOptions } from './shareds/configs/app.config';
import { logger } from './shareds/utils/logger';
import { Express } from 'express';
import * as swaggerUiExpress from 'swagger-ui-express';
import { spec } from './shareds/configs/swagger.config';
import { useContainer } from 'typeorm';
import { Container } from 'typedi';

export function main() {
    const app: Express = createExpressServer(routingControllersOptions);

    app.use('/swagger.html', swaggerUiExpress.serve, swaggerUiExpress.setup(spec));
    
    useContainer(Container);

    loaders(app);

    process.on('SIGTERM', () => {
        logger.info('SIGTERM signal received.');
        logger.info('Closing database connection.');
    });
}

main();
