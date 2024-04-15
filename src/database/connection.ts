import { Connection, createConnection, getConnectionManager } from 'typeorm';
import { dataSourceOptions } from './data-source';
import { logger } from '../shareds/utils/logger';

export default async function initializeDataSource(): Promise<Connection | void> {
    try {        
        const conn = await createConnection(dataSourceOptions);
        logger.info(
            `Database status connection: ${conn.isConnected}. Connection: '${conn.name}' Database: '${conn.options.database}'`,
        );
    } catch (error: any) {
        if (error.name === 'AlreadyHasActiveConnectionError') {
            const activeConnection = getConnectionManager().get(dataSourceOptions.name);
            return activeConnection;
        }
        logger.error('Failed to connect to the database:', error);
        process.exit(1);
    }
    return null;
}
