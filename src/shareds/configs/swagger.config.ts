import { getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import { routingControllersOptions } from './app.config';
const { defaultMetadataStorage } = require('class-transformer/cjs/storage');
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';

const storage = getMetadataArgsStorage();

const classValidatorSchemas = validationMetadatasToSchemas({
    classTransformerMetadataStorage: defaultMetadataStorage,
    refPointerPrefix: '#/components/schemas/',
});

export const spec = routingControllersToSpec(storage, routingControllersOptions, {
    components: {
        schemas: classValidatorSchemas,
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
});
