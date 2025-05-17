import { Injectable } from '@nestjs/common';
import {
	DocumentChunkRepository,
	QueriedChunkType,
} from '../domain/repositories/document-chunk.repository';

@Injectable()
export class GetDocumentChunksUseCase {
	constructor(
		private readonly documentChunkRepository: DocumentChunkRepository,
	) {}

	async execute(documentId: number): Promise<QueriedChunkType[]> {
		return this.documentChunkRepository.findByDocumentId(documentId);
	}
}
