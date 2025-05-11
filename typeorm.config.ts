import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

// CLI에서 사용할 DataSource 인스턴스
export default new DataSource({
	type: 'mysql',
	host: process.env.DB_HOST || 'localhost',
	port: parseInt(process.env.DB_PORT || '3306'),
	username: process.env.DB_USERNAME || 'root',
	password: process.env.DB_PASSWORD || 'root',
	database: process.env.DB_DATABASE || 'conversation',
	entities: ['src/**/*.entity.ts'],
	migrations: ['db/migrations/*.ts'],
});
