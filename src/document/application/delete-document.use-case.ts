import { Injectable } from '@nestjs/common';
import { DocumentRepository } from '../domain/repositories/document.repository';
import { DocumentChunkRepository } from '../domain/repositories/document-chunk.repository';

@Injectable()
export class DeleteDocumentUseCase {
	constructor(
		private readonly documentRepository: DocumentRepository,
		private readonly documentChunkRepository: DocumentChunkRepository,
	) {}

	async execute(id: number): Promise<void> {
		const chunks = await this.documentChunkRepository.findByDocumentId(id);
		if (chunks.length > 0) {
			await this.documentChunkRepository.deleteByDocumentId(id);
		}
		await this.documentRepository.delete(id);
	}
}
