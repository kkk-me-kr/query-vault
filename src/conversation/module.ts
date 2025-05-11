import { Module } from '@nestjs/common';
import { ConversationController } from './interface/http/controller';
import { CreateConversationUseCase } from './application/create-conversation.use-case';
import { CreateTurnUseCase } from './application/create-turn.use-case';
import { ConversationService } from './domain/service';
import { ConversationRepository } from './domain/abstract.repository';
import { ConversationTypeOrmRepository } from './infrastructure/persistence/typeorm.repository';
import { GetUserConversationsUseCase } from './application/get-user-conversations.use-case';
import { GetQuestionsUseCase } from './application/get-questions.use-case';
import { GetAnswersUseCase } from './application/get-answers.use-case';
import { GetTurnPairsUseCase } from './application/get-turn-pairs.use-case';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './domain/entities/conversation.entity';
import { Question } from './domain/entities/question.entity';
import { Answer } from './domain/entities/answer.entity';

const useCases = [
	GetUserConversationsUseCase,
	CreateConversationUseCase,
	CreateTurnUseCase,
	GetQuestionsUseCase,
	GetAnswersUseCase,
	GetTurnPairsUseCase,
];

const domainServices = [ConversationService];

const repositories = [
	{
		provide: ConversationRepository,
		useClass: ConversationTypeOrmRepository,
	},
];

@Module({
	imports: [TypeOrmModule.forFeature([Conversation, Question, Answer])],
	controllers: [ConversationController],
	providers: [...useCases, ...domainServices, ...repositories],
	exports: [],
})
export class ConversationModule {}
