import { CreateConversationUseCase } from '@/conversation/application/create-conversation.use-case';
import { GetAnswersUseCase } from '@/conversation/application/get-answers.use-case';
import { GetQuestionsUseCase } from '@/conversation/application/get-questions.use-case';
import { GetTurnPairsUseCase } from '@/conversation/application/get-turn-pairs.use-case';
import { GetUserConversationsUseCase } from '@/conversation/application/get-user-conversations.use-case';
import { CreateTurnUseCase } from '@/conversation/application/create-turn.use-case';
import {
	Body,
	Controller,
	Get,
	Param,
	ParseIntPipe,
	Post,
	Query,
} from '@nestjs/common';

@Controller('conversations')
export class ConversationController {
	constructor(
		private readonly createConversationUseCase: CreateConversationUseCase,
		private readonly queryUseCase: CreateTurnUseCase,
		private readonly getUserConversationsUseCase: GetUserConversationsUseCase,
		private readonly getQuestionsUseCase: GetQuestionsUseCase,
		private readonly getAnswersUseCase: GetAnswersUseCase,
		private readonly getTurnPairsUseCase: GetTurnPairsUseCase,
	) {}

	@Post()
	async createConversation(
		@Body('userId') userId: string,
		@Body('title') title: string | undefined,
	) {
		return this.createConversationUseCase.execute(userId, title);
	}

	@Post(':id/turns')
	async query(
		@Param('id', ParseIntPipe) id: number,
		@Body('query') query: string,
	) {
		return this.queryUseCase.execute(id, query);
	}

	@Get()
	async getUserConversations(@Query('userId') userId: string) {
		return this.getUserConversationsUseCase.execute(userId);
	}

	@Get(':id/questions')
	async getQuestions(@Param('id', ParseIntPipe) id: number) {
		return this.getQuestionsUseCase.execute(id);
	}

	@Get(':id/answers')
	async getAnswers(@Param('id', ParseIntPipe) id: number) {
		return this.getAnswersUseCase.execute(id);
	}

	@Get(':id/:turn')
	async getTurnPairs(
		@Param('id', ParseIntPipe) id: number,
		@Param('turn', ParseIntPipe) turn: number,
	) {
		return this.getTurnPairsUseCase.execute(id, turn);
	}
}
