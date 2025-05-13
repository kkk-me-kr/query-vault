import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import path from 'path';
import { Document } from '@/document/domain/entities/document.entity';
import { Conversation } from '@/conversation/domain/entities/conversation.entity';
import { Question } from '@/conversation/domain/entities/question.entity';
import { Answer } from '@/conversation/domain/entities/answer.entity';
import { DocumentType } from '@/document/domain/entities/document-type.entity';
import { DocumentChunk } from '@/document/domain/entities/document-chunk.entity';

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => {
				return {
					host: configService.get<string>('DB_HOST', 'localhost'),
					port: configService.get<number>('DB_PORT', 3306),
					username: configService.get<string>('DB_USERNAME', 'user'),
					password: configService.get<string>('DB_PASSWORD', 'password'),
					database: configService.get<string>('DB_DATABASE', 'db'),
					type: 'mysql',
					entities: [
						Conversation,
						Question,
						Answer,
						Document,
						DocumentType,
						DocumentChunk,
					],
					synchronize: configService.get('NODE_ENV') !== 'production',
					logging: configService.get('NODE_ENV') !== 'production',
					charset: 'utf8mb4',
					collation: 'utf8mb4_unicode_ci',
				};
			},
		}),
	],
})
export class TypeOrmConfigModule {}
