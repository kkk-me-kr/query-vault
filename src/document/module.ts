import { Module } from '@nestjs/common';
import { DocumentController } from './interface/http/controller';
import { EmbeddingModule } from '@/shared/services/embedding/module';
import { CreateDocumentUseCase } from './application/create-document.use-case';
import { CreateDocumentTypeUseCase } from './application/create-document-type.use-case';
import { DocumentService } from './domain/services/document.service';
import { DocumentTypeService } from './domain/services/document-type.service';
import { DocumentTypeOrmRepository } from './infrastructure/document-typeorm.repository';
import { DocumentChunkService } from './domain/services/document-chunk.service';
import { DocumentChunkChromaRepository } from './infrastructure/document-chunk-chroma.repository';
import { DocumentTypeTypeOrmRepository } from './infrastructure/document-type-typeorm.repository';
import { DocumentRepository } from './domain/repositories/document.repository';
import { DocumentChunkRepository } from './domain/repositories/document-chunk.repository';
import { DocumentTypeRepository } from './domain/repositories/document-type.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './domain/entities/document.entity';
import { DocumentType } from './domain/entities/document-type.entity';
import { CreateDocumentChunkUseCase } from './application/create-document-chunk.use-case';
import { RetrieveAllDocumentUseCase } from './application/retrieve-all-document.use-case';
import { DeleteDocumentUseCase } from './application/delete-document.use-case';
import { LlmModule } from '@/shared/services/llm/module';

const useCases = [
	CreateDocumentUseCase,
	CreateDocumentTypeUseCase,
	CreateDocumentChunkUseCase,
	RetrieveAllDocumentUseCase,
	DeleteDocumentUseCase,
];

const domainServices = [
	DocumentService,
	DocumentChunkService,
	DocumentTypeService,
];

const repositories = [
	{
		provide: DocumentRepository,
		useClass: DocumentTypeOrmRepository,
	},
	{
		provide: DocumentChunkRepository,
		useClass: DocumentChunkChromaRepository,
	},
	{
		provide: DocumentTypeRepository,
		useClass: DocumentTypeTypeOrmRepository,
	},
];

@Module({
	imports: [
		TypeOrmModule.forFeature([Document, DocumentType]),
		EmbeddingModule,
		LlmModule,
	],
	providers: [...useCases, ...domainServices, ...repositories],
	controllers: [DocumentController],
	exports: [RetrieveAllDocumentUseCase],
})
export class DocumentModule {}
