import { DocumentService } from '../domain/services/document.service';
import { EmbeddingService } from '@/shared/services/embedding/service';
import { DocumentChunkService } from '../domain/services/document-chunk.service';
import { BadRequestException, Injectable } from '@nestjs/common';
@Injectable()
export class RetrieveAllDocumentUseCase {
	constructor(
		private readonly documentService: DocumentService,
		private readonly documentChunkService: DocumentChunkService,
		private readonly embeddingService: EmbeddingService,
	) {}

	async execute(query: string) {
		if (query.length === 0) {
			throw new BadRequestException('Query is required');
		}

		const embedding = await this.embeddingService.generateEmbedding(
			query.trim(),
		);

		const similarChunks =
			await this.documentChunkService.findSimilarChunksInAllDocuments(
				[Array.from(embedding)],
				5,
			);

		// TODO: distance가 생각보다 높은 경우가 많아 필터링을 제거하고 topK를 낮춤, 추후 조정 필요
		const highlySimilarChunks = similarChunks;
		// similarChunks.filter(
		// 	chunk => chunk.distance && chunk.distance <= 0.5,
		// );

		if (highlySimilarChunks.length === 0) {
			return [];
		}

		const matchedDocumentIds = new Set(
			highlySimilarChunks.map(chunk => chunk.documentId),
		);

		const documents = await Promise.all(
			Array.from(matchedDocumentIds).map(id =>
				this.documentService.findDocument(id),
			),
		);
		const result = documents.map(document => {
			if (!document) {
				return null;
			}
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { content, ...rest } = document;
			const matchedChunks = highlySimilarChunks.filter(
				chunk => chunk.documentId === document.id,
			);
			return {
				...rest,
				matchedChunks,
			};
		});

		return result.filter(result => result !== null);
	}
}
