import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Post,
	Put,
	Query,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { CreateDocumentUseCase } from '../../application/create-document.use-case';
import { CreateDocumentDto } from './dto/create-document.dto';
import { CreateDocumentTypeDto } from './dto/create-document-type.dto';
import { CreateDocumentTypeUseCase } from '@/document/application/create-document-type.use-case';
import { PutDocumentChunkUseCase } from '@/document/application/put-document-chunk.use-case';
import { FileInterceptor } from '@nestjs/platform-express';
import { RetrieveAllDocumentUseCase } from '@/document/application/retrieve-all-document.use-case';
import { DeleteDocumentUseCase } from '@/document/application/delete-document.use-case';
@Controller('documents')
export class DocumentController {
	constructor(
		private readonly createDocumentUseCase: CreateDocumentUseCase,
		private readonly createDocumentTypeUseCase: CreateDocumentTypeUseCase,
		private readonly putDocumentChunkUseCase: PutDocumentChunkUseCase,
		private readonly retrieveAllDocumentUseCase: RetrieveAllDocumentUseCase,
		private readonly deleteDocumentUseCase: DeleteDocumentUseCase,
	) {}

	@Post()
	@UseInterceptors(FileInterceptor('fileContent'))
	async create(
		@Body() body: CreateDocumentDto,
		@UploadedFile()
		fileContent: Express.Multer.File,
	) {
		return this.createDocumentUseCase.execute({
			title: body.title,
			source: body.source,
			textContent: body.content,
			fileContent,
			contentTypeId: body.contentTypeId,
		});
	}

	@Post('types')
	async createType(@Body() body: CreateDocumentTypeDto) {
		return this.createDocumentTypeUseCase.execute(body.name, body.description);
	}

	@Put(':id/chunks')
	async createChunk(
		@Param('id', ParseIntPipe) id: number,
		@Body('seperators') seperators?: string[],
	) {
		return this.putDocumentChunkUseCase.execute(id, seperators);
	}

	@Get('retrieve')
	async retrieve(@Query('query') query: string) {
		return this.retrieveAllDocumentUseCase.execute(query);
	}

	@Delete(':id')
	async delete(@Param('id', ParseIntPipe) id: number) {
		return this.deleteDocumentUseCase.execute(id);
	}
}
