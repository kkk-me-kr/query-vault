import { DocumentTypeService } from '../domain/services/document-type.service';
import { DocumentType } from '../domain/entities/document-type.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateDocumentTypeUseCase {
	constructor(private readonly documentTypeService: DocumentTypeService) {}

	async execute(name: string, description: string | undefined): Promise<void> {
		await this.documentTypeService.createDocumentType(name, description);
	}
}
