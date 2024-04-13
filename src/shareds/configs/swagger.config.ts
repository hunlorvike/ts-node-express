import { getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import { routingControllersOptions } from './app.config';
import { OpenAPIObject } from 'openapi3-ts/oas30';

const storage = getMetadataArgsStorage();

export const spec: OpenAPIObject = routingControllersToSpec(
   storage,
   routingControllersOptions,
   {
      components: {
         securitySchemes: {
            Bearer: {
               scheme: 'bearer',
               type: 'http',
               bearerFormat: 'JWT',
            },
         },
      },
      info: {
         description: 'Generated with `routing-controllers-openapi`',
         title: 'Typescript Nodejs Express',
         version: '1.0.0',
         termsOfService: '',
         contact: {
            name: 'Nguyen Viet Hung',
            email: 'hungcutedethuongg@gmail.com',
         },
         license: {
            name: 'ts-node-express',
         },
      },
   },
);
