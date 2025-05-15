import { DocumentService } from '../domain/services/document.service';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class CreateDocumentUseCase {
	constructor(private readonly documentService: DocumentService) {}

	async execute(dto: {
		title: string;
		source: string;
		textContent?: string;
		fileContent?: Express.Multer.File;
		contentTypeId?: number;
	}): Promise<void> {
		let content: string;
		if (dto.fileContent !== undefined) {
			const fileType = dto.fileContent.mimetype;
			// TODO: text외 pdf 등도 호환되도록 개선 필요
			if (fileType !== 'text/plain' && fileType !== 'text/markdown') {
				throw new BadRequestException('File type not supported');
			}
			content = dto.fileContent.buffer.toString('utf-8');
		} else if (dto.textContent !== undefined) {
			content = dto.textContent;
		} else {
			throw new BadRequestException('Content is required');
		}

		return this.documentService.createDocument(
			dto.title,
			content,
			dto.source,
			dto.contentTypeId,
		);
	}
}
