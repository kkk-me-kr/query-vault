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
	Headers,
	Param,
	ParseIntPipe,
	Post,
	Query,
} from '@nestjs/common';

// TODO: USER_ID Guard 적용
@Controller('conversations')
export class ConversationController {
	constructor(
		private readonly createConversationUseCase: CreateConversationUseCase,
		private readonly queryUseCase: CreateTurnUseCase,
		private readonly getUserConversationsUseCase: GetUserConversationsUseCase,
		private readonly getQuestionsUseCase: GetQuestionsUseCase,
		private readonly getAnswersUseCase: GetAnswersUseCase,
		private readonly getTurnPairsUseCase: GetTurnPairsUseCase,
	) { }

	@Post()
	async createConversation(
		@Headers('x-user-id') userId: string,
		@Body('title') title: string | undefined,
	) {
		return this.createConversationUseCase.execute(userId, title);
	}

	@Post(':id/turns')
	async query(
		@Param('id', ParseIntPipe) id: number,
		@Headers('x-user-id') userId: string | undefined,
		@Body('query') query: string,
	) {
		return this.queryUseCase.execute(id, { query, userId: userId });
	}

	@Get()
	async getUserConversations(@Headers('x-user-id') userId: string) {
		return this.getUserConversationsUseCase.execute(userId);
	}

	@Get(':id/turns')
	async getTurnPairs(
		@Param('id', ParseIntPipe) id: number,
		@Headers('x-user-id') userId: string | undefined,
	) {
		return this.getTurnPairsUseCase.execute(id, userId);
	}
}
