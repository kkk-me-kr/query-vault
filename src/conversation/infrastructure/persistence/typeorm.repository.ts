import { Answer } from '@/conversation/domain/entities/answer.entity';
import {
	Conversation,
	ConversationStatus,
} from '@/conversation/domain/entities/conversation.entity';
import { Question } from '@/conversation/domain/entities/question.entity';
import { ConversationRepository } from '@/conversation/domain/abstract.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConverstaionTypeOrmRepository implements ConversationRepository {
	async create(
		userId: string,
		status: ConversationStatus,
		title?: string,
	): Promise<void> {}

	async createQuestion(
		conversationId: number,
		turn: number,
		content: string,
	): Promise<void> {}

	async createAnswer(
		conversationId: number,
		turn: number,
		content: string,
	): Promise<void> {}

	async findById(conversationId: number): Promise<Conversation> {
		return new Conversation();
	}

	async findByUserId(userId: string): Promise<Conversation[]> {
		return [];
	}

	async findLatestOneByUserId(userId: string): Promise<Conversation> {
		return new Conversation();
	}

	async findLastTurnByConversationId(conversationId: number): Promise<number> {
		return 0;
	}

	async findQuestionsByConversationId(
		conversationId: number,
	): Promise<Question[]> {
		return [];
	}

	async findAnswersByConversationId(conversationId: number): Promise<Answer[]> {
		return [];
	}

	async findPairsByConversationTurn(
		conversationId: number,
		turn: number,
	): Promise<{
		question: Question | undefined | null;
		answer: Answer | undefined | null;
	}> {
		return {
			question: null,
			answer: null,
		};
	}

	async update(conversation: Conversation): Promise<void> {}

	async delete(conversationId: number): Promise<void> {}

	async deleteTurn(conversationId: number, turn: number): Promise<void> {}
}
