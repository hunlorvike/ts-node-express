import { Connection, createConnection, getConnectionManager } from 'typeorm';
import { dataSourceOptions } from './data-source';
import { logger } from '../shareds/utils/logger';

export default async function initializeDataSource(): Promise<Connection | void> {
   try {
      const conn = await createConnection(dataSourceOptions);
      console.log(
         `Database connection success. Connection name: '${conn.name}' Database: '${conn.options.database}'`,
      );
   } catch (error: any) {
      if (error.name === 'AlreadyHasActiveConnectionError') {
         const activeConnection = getConnectionManager().get(dataSourceOptions.name);
         return activeConnection;
      }
      logger.error('Failed to connect to the database:', error);
   }
   return null;
}
