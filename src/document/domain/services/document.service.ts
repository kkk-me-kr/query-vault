import { Injectable } from '@nestjs/common';
import { DocumentRepository } from '../repositories/document.repository';
import { EmbeddingService } from '@/shared/services/embedding/service';
import { Document } from '../entities/document.entity';

@Injectable()
export class DocumentService {
	constructor(
		private readonly documentRepository: DocumentRepository,
		private readonly embeddingService: EmbeddingService,
	) {}

	async createDocument(
		title: string,
		content: string,
		source: string,
		documentTypeId?: number | null,
	): Promise<void> {
		await this.documentRepository.create(
			title,
			content,
			source,
			documentTypeId,
		);
	}

	async findDocument(id: number): Promise<Document> {
		return this.documentRepository.findById(id);
	}

	async findAllDocuments(): Promise<Document[]> {
		return this.documentRepository.findAll();
	}
}
