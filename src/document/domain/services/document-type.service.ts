import { Injectable } from '@nestjs/common';
import { DocumentTypeRepository } from '../repositories/document-type.repository';
import { DocumentType } from '../entities/document-type.entity';

@Injectable()
export class DocumentTypeService {
	constructor(
		private readonly documentTypeRepository: DocumentTypeRepository,
	) {}

	async createDocumentType(name: string, description?: string): Promise<void> {
		await this.documentTypeRepository.create(name, description);
	}

	async findDocumentType(id: number): Promise<DocumentType | null> {
		return this.documentTypeRepository.findById(id);
	}

	async findAllDocumentTypes(): Promise<DocumentType[]> {
		return this.documentTypeRepository.findAll();
	}
}
