import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentType } from '../domain/entities/document-type.entity';
import { DocumentTypeRepository } from '../domain/repositories/document-type.repository';

@Injectable()
export class DocumentTypeTypeOrmRepository extends DocumentTypeRepository {
	constructor(
		@InjectRepository(DocumentType)
		private readonly repo: Repository<DocumentType>,
	) {
		super();
	}

	async create(name: string, description?: string): Promise<void> {
		const docType = this.repo.create({ name, description });
		await this.repo.save(docType);
	}

	async findById(id: number): Promise<DocumentType | null> {
		const docType = await this.repo.findOneBy({ id });
		return docType;
	}

	async findByName(name: string): Promise<DocumentType | null> {
		const docType = await this.repo.findOneBy({ name });
		return docType;
	}

	async findAll(): Promise<DocumentType[]> {
		return this.repo.find();
	}

	async update(documentType: DocumentType): Promise<void> {
		await this.repo.update(documentType.id, documentType);
	}

	async delete(id: number): Promise<void> {
		await this.repo.delete(id);
	}
}
