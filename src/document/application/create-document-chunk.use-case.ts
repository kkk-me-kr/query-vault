import { Injectable } from '@nestjs/common';
import { DocumentChunkRepository } from '../domain/repositories/document-chunk.repository';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { DocumentChunkService } from '../domain/services/document-chunk.service';
import { DocumentService } from '../domain/services/document.service';
import { EmbeddingService } from '@/shared/services/embedding/service';

@Injectable()
export class CreateDocumentChunkUseCase {
	constructor(
		private readonly documentService: DocumentService,
		private readonly documentChunkService: DocumentChunkService,
		private readonly embeddingService: EmbeddingService,
	) {}

	async execute(documentId: number, seperators?: string[]) {
		const document = await this.documentService.findDocument(documentId);

		const chunkSize = 300;
		const chunkOverlap = chunkSize * 0.2;
		let chunkTexts: string[];
		// NOTE: 구분자가 명확히 있는 경우 구분자를 기준으로 자르고, 없는 경우 최대 청크 사이즈 기준 재귀적으로 자른다.
		if (seperators && seperators.length > 0) {
			chunkTexts = document.content.split(
				new RegExp(seperators.join('|'), 'g'),
			);
		} else {
			const textSplitter = new RecursiveCharacterTextSplitter({
				chunkSize,
				chunkOverlap,
				// chunkOverlap,
				separators: [
					...RecursiveCharacterTextSplitter.getSeparatorsForLanguage(
						'markdown',
					),
				],
				keepSeparator: true,
			});
			chunkTexts = await textSplitter.splitText(document.content);
		}

		const chunckedData = await Promise.all(
			chunkTexts.map(async chunkText => {
				const embedding =
					await this.embeddingService.generateEmbedding(chunkText);
				return {
					content: chunkText,
					embedding: Array.from(embedding),
				};
			}),
		);
		await this.documentChunkService.createDocumentChunks(
			documentId,
			chunckedData,
		);
	}
}
