import dataSource from "./data-source";
import { DataSource } from 'typeorm';

/**
 * Khởi tạo và kết nối đến nguồn dữ liệu.
 * Trả về một Promise chứa đối tượng DataSource đã được khởi tạo.
 * Nếu có lỗi xảy ra trong quá trình khởi tạo, nó sẽ throw ra một Error.
 */
export default async function initializeDataSource(): Promise<DataSource> {
    try {
        return await dataSource.initialize();
    } catch (error) {
        console.error('Failed to initialize the data source:', error);
        throw error;
    }
}
