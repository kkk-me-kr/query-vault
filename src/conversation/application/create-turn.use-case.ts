import { Injectable } from '@nestjs/common';
import { ConversationService } from '../domain/service';
import { RetrieveAllDocumentUseCase } from '@/document/application/retrieve-all-document.use-case';
import * as fs from 'fs';
import * as Handlebars from 'handlebars';
import { LlmService } from '@/shared/services/llm/service';
import { resolve } from 'path';

@Injectable()
export class CreateTurnUseCase {
	private readonly queryCompressionSystemTemplate: Handlebars.TemplateDelegate;
	private readonly queryCompressionUserTemplate: Handlebars.TemplateDelegate;
	private readonly systemTemplate: Handlebars.TemplateDelegate;
	private readonly userTemplate: Handlebars.TemplateDelegate;

	constructor(
		private readonly conversationService: ConversationService,
		private readonly llmService: LlmService,
		private readonly retrieveAllDocumentUseCase: RetrieveAllDocumentUseCase,
	) {
		const systemTemplateSource = fs.readFileSync(
			resolve('src/shared/prompts/rag-based-chat/system.md'),
			'utf-8',
		);
		const userTemplateSource = fs.readFileSync(
			resolve('src/shared/prompts/rag-based-chat/user.hbs'),
			'utf-8',
		);
		this.systemTemplate = Handlebars.compile(systemTemplateSource);
		this.userTemplate = Handlebars.compile(userTemplateSource);

		const queryCompressionSystemTemplateSource = fs.readFileSync(
			resolve('src/shared/prompts/query-compression/system.md'),
			'utf-8',
		);
		const queryCompressionUserTemplateSource = fs.readFileSync(
			resolve('src/shared/prompts/query-compression/user.hbs'),
			'utf-8',
		);
		this.queryCompressionSystemTemplate = Handlebars.compile(
			queryCompressionSystemTemplateSource,
		);
		this.queryCompressionUserTemplate = Handlebars.compile(
			queryCompressionUserTemplateSource,
		);
	}

	getNearestDistanceOnRetrievedData(
		retrievedData: Awaited<
			ReturnType<typeof this.retrieveAllDocumentUseCase.execute>
		>,
	) {
		return retrievedData.reduce((acc, cur) => {
			const nearestDistanceInDocument = cur.matchedChunks.reduce((acc, cur) => {
				return Math.min(acc, cur.distance ?? Infinity);
			}, Infinity);
			return Math.min(acc, nearestDistanceInDocument);
		}, Infinity);
	}

	async execute(conversationId: number, query: string) {
		const nextTurn =
			await this.conversationService.findNextTurn(conversationId);

		await this.conversationService.postQuestion(
			conversationId,
			nextTurn,
			query,
		);

		// NOTE: 사용자의 질의문을 압축합니다.
		const queryCompressionSystemPrompt = this.queryCompressionSystemTemplate(
			{},
		);
		const queryCompressionUserPrompt = this.queryCompressionUserTemplate({
			question: query,
		});
		console.log(`queryCompressing Start, original: ${query}`);
		const compressedQuery = await this.llmService.generateAnswer(
			queryCompressionSystemPrompt,
			queryCompressionUserPrompt,
			'gpt-4o-mini',
		);
		console.log(`queryCompressing End, compressed: ${compressedQuery}`);

		const retrievedDataByQuery =
			await this.retrieveAllDocumentUseCase.execute(query);
		const retrievedDataByCompressedQuery =
			await this.retrieveAllDocumentUseCase.execute(compressedQuery);

		const retrievedData = [
			...retrievedDataByQuery,
			...retrievedDataByCompressedQuery,
		];

		const contexts = retrievedData.reduce((acc, cur) => {
			const contexts = cur.matchedChunks.map(chunk => ({
				text: chunk.content,
				metadata: {
					documentTitle: cur.title,
					source: cur.source,
					...chunk.metadata,
				},
			}));

			return [...acc, ...contexts];
		}, []);
		console.log(contexts);

		if (contexts.length === 0) {
			return 'I’m sorry, but I don’t have that information.';
		}

		const systemPrompt = this.systemTemplate({});
		const userPrompt = this.userTemplate({
			contexts,
			question: query,
		});
		console.log(systemPrompt);
		console.log(userPrompt);

		const answer = await this.llmService.generateAnswer(
			systemPrompt,
			userPrompt,
		);

		await this.conversationService.postAnswer(conversationId, nextTurn, answer);

		return answer;
	}
}
