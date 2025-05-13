import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from '../domain/entities/document.entity';
import { DocumentRepository } from '../domain/repositories/document.repository';

@Injectable()
export class DocumentTypeOrmRepository extends DocumentRepository {
	constructor(
		@InjectRepository(Document)
		private readonly repository: Repository<Document>,
	) {
		super();
	}

	async create(
		title: string,
		content: string,
		source: string,
		documentTypeId?: number | null,
	): Promise<void> {
		const document = new Document();
		document.documentTypeId = documentTypeId;
		document.title = title;
		document.content = content;
		document.source = source;
		await this.repository.save(document);
	}

	async findById(id: number): Promise<Document> {
		const doc = await this.repository.findOneBy({ id });
		if (!doc) throw new Error('Document not found');
		return doc;
	}

	async findAll(): Promise<Document[]> {
		return this.repository.find();
	}

	async update(document: Document): Promise<Document> {
		await this.repository.update(document.id, document);
		return this.findById(document.id);
	}

	async delete(id: number): Promise<void> {
		await this.repository.delete(id);
	}
}
