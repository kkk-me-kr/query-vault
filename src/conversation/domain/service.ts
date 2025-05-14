import { Injectable } from '@nestjs/common';
import { ConversationRepository } from './repository';
import { Conversation } from './entities/conversation.entity';
import { Question } from './entities/question.entity';
import { Answer } from './entities/answer.entity';

@Injectable()
export class ConversationService {
	constructor(private readonly repository: ConversationRepository) {}

	async create(userId: string, title?: string) {
		const conversation = await this.repository.create(userId, 'ACTIVE', title);
		return conversation;
	}

	async postQuestion(conversationId: number, turn: number, content: string) {
		await this.repository.createQuestion(conversationId, turn, content);
	}

	async postAnswer(conversationId: number, turn: number, content: string) {
		await this.repository.createAnswer(conversationId, turn, content);
	}

	async findByUserId(userId: string): Promise<Conversation[]> {
		const conversations = await this.repository.findByUserId(userId);
		return conversations;
	}

	async findLatestOneByUserId(
		userId: string,
	): Promise<Conversation | undefined | null> {
		const conversation = await this.repository.findLatestOneByUserId(userId);
		return conversation;
	}

	async findNextTurn(conversationId: number): Promise<number> {
		const lastTurn =
			await this.repository.findLastTurnByConversationId(conversationId);

		const nextTurn = lastTurn ? lastTurn + 1 : 1;

		return nextTurn;
	}

	async findQuestionsByConversationId(
		conversationId: number,
	): Promise<Question[]> {
		const questions =
			await this.repository.findQuestionsByConversationId(conversationId);
		return questions;
	}

	async findAnswersByConversationId(conversationId: number): Promise<Answer[]> {
		const answers =
			await this.repository.findAnswersByConversationId(conversationId);
		return answers;
	}

	async findPairsByConversationTurn(
		conversationId: number,
		turn: number,
	): Promise<{
		question: Question | undefined | null;
		answer: Answer | undefined | null;
	}> {
		const answer = await this.repository.findPairsByConversationTurn(
			conversationId,
			turn,
		);
		return answer;
	}

	async checkExists(conversationId: number): Promise<boolean> {
		const conversation = await this.repository.findById(conversationId);
		return conversation !== null;
	}
}
