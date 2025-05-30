import { Injectable, NotFoundException } from '@nestjs/common';
import { ConversationService } from '../domain/service';
import { RetrieveAllDocumentUseCase } from '@/document/application/retrieve-all-document.use-case';
import * as fs from 'fs';
import * as Handlebars from 'handlebars';
import { LlmService } from '@/shared/services/llm/service';
import { resolve } from 'path';
import { ConfigService } from '@nestjs/config';
import { Question } from '../domain/entities/question.entity';
import { Answer } from '../domain/entities/answer.entity';

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
		private readonly configService: ConfigService,
	) {
		const systemTemplateSource = fs.readFileSync(
			resolve('src/shared/prompts/rag-based-chat/system.hbs'),
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

	private async compressQuery(query: string) {
		const queryCompressionSystemPrompt = this.queryCompressionSystemTemplate(
			{},
		);
		const queryCompressionUserPrompt = this.queryCompressionUserTemplate({
			question: query,
		});
		const compressedQuery = await this.llmService.generateAnswer(
			queryCompressionSystemPrompt,
			queryCompressionUserPrompt,
			'gpt-4o-mini',
		);
		return compressedQuery;
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

	private async getRetrievedData(queries: string[]) {
		const retrievedData = await Promise.all(
			queries.map(async query => {
				const retrievedData =
					await this.retrieveAllDocumentUseCase.execute(query);
				return retrievedData;
			}),
		);
		return retrievedData.flat();
	}

	private async generateAnswer(query, contexts: { text: string; metadata: Record<string, any> }[], previousTurns: { question: Question; answer: Answer | undefined }[]) {
		const previousTurnsPrompt = previousTurns.map(turn => {
			return {
				question: turn.question.content,
				answer: turn.answer?.content,
			};
		});

		const systemPrompt = this.systemTemplate({
			subject: this.configService.get<string>('CONVERSATION_ANSWER_SUBJECT'),
			role: this.configService.get<string>('CONVERSATION_ANSWER_ROLE'),
		});
		const userPrompt = this.userTemplate({
			contexts,
			question: query,
			previousTurns: previousTurnsPrompt,
		});

		const answer = await this.llmService.generateAnswer(
			systemPrompt,
			userPrompt,
		);

		return answer;
	}


	async execute(
		conversationId: number,
		{ query, userId }: { query: string; userId: string | undefined | null },
	) {
		if (!userId || !(await this.conversationService.checkExists(conversationId, userId))) {
			throw new NotFoundException('Conversation not found');
		}

		const nextTurn =
			await this.conversationService.findNextTurn(conversationId);

		// NOTE: 사용자의 질의문을 압축합니다.
		const compressedQuery = await this.compressQuery(query);
		const retrievedData = await this.getRetrievedData([query, compressedQuery]);

		const contexts = retrievedData.reduce(
			(acc, cur) => {
				// 중복 제거
				const filteredChunks = cur.matchedChunks.filter(
					chunk => !acc.find(context => context.text === chunk.content),
				);
				// 원본 텍스트외 모두 메타데이터 취급
				const contexts = filteredChunks.map(chunk => ({
					text: chunk.content,
					metadata: {
						documentTitle: cur.title,
						source: cur.source,
						...chunk.metadata,
					},
				}));

				return [...acc, ...contexts];
			},
			[] as {
				text: string;
				metadata: Record<string, any>;
			}[],
		);

		const previousTurns =
			await this.conversationService.findAllTurns(conversationId);

		const answerContent = await this.generateAnswer(query, contexts, previousTurns);

		// TODO: Transaction
		await this.conversationService.postQuestion(
			conversationId,
			nextTurn,
			query,
		);
		await this.conversationService.postAnswer(
			conversationId,
			nextTurn,
			answerContent,
		);

		const { question, answer } =
			await this.conversationService.findPairsByConversationTurn(
				conversationId,
				nextTurn,
			);

		return {
			question,
			answer,
		};
	}
}
