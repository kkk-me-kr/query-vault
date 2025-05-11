import { Answer } from './entities/answer.entity';
import {
	Conversation,
	ConversationStatus,
} from './entities/conversation.entity';
import { Question } from './entities/question.entity';

export abstract class ConversationRepository {
	abstract create(
		userId: string,
		status: ConversationStatus,
		title?: string,
	): Promise<void>;
	abstract createQuestion(
		conversationId: number,
		turn: number,
		content: string,
	): Promise<void>;
	abstract createAnswer(
		conversationId: number,
		turn: number,
		content: string,
	): Promise<void>;

	abstract findById(
		conversationId: number,
	): Promise<Conversation | undefined | null>;
	abstract findByUserId(userId: string): Promise<Conversation[]>;
	abstract findLatestOneByUserId(
		userId: string,
	): Promise<Conversation | undefined | null>;
	abstract findLastTurnByConversationId(
		conversationId: number,
	): Promise<number>;
	abstract findQuestionsByConversationId(
		conversationId: number,
	): Promise<Question[]>;
	abstract findAnswersByConversationId(
		conversationId: number,
	): Promise<Answer[]>;
	abstract findPairsByConversationTurn(
		conversationId: number,
		turn: number,
	): Promise<{
		question: Question | undefined | null;
		answer: Answer | undefined | null;
	}>;

	abstract update(conversation: Conversation): Promise<void>;
	abstract delete(conversationId: number): Promise<void>;

	abstract deleteTurn(conversationId: number, turn: number): Promise<void>;
}
