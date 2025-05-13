/* eslint-disable @typescript-eslint/require-await */
import { Answer } from '@/conversation/domain/entities/answer.entity';
import {
	Conversation,
	ConversationStatus,
} from '@/conversation/domain/entities/conversation.entity';
import { Question } from '@/conversation/domain/entities/question.entity';
import { ConversationRepository } from '@/conversation/domain/repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConversationInmemoryRepository implements ConversationRepository {
	conversations: Conversation[] = [];
	questions: Question[] = [];
	answers: Answer[] = [];

	async create(
		userId: string,
		status: ConversationStatus,
		title?: string,
	): Promise<void> {
		const conversation = new Conversation();
		conversation.id = this.conversations.length + 1;
		conversation.userId = userId;
		conversation.status = status;
		conversation.title = title;
		this.conversations.push(conversation);
	}

	async createQuestion(
		conversationId: number,
		turn: number,
		content: string,
	): Promise<void> {
		const question = new Question();
		question.conversationId = conversationId;
		question.turn = turn;
		question.content = content;
		this.questions.push(question);
	}

	async createAnswer(
		conversationId: number,
		turn: number,
		content: string,
	): Promise<void> {
		const answer = new Answer();
		answer.conversationId = conversationId;
		answer.turn = turn;
		answer.content = content;
		this.answers.push(answer);
	}

	async findById(
		conversationId: number,
	): Promise<Conversation | undefined | null> {
		return this.conversations.find(
			conversation => conversation.id === conversationId,
		);
	}

	async findByUserId(userId: string): Promise<Conversation[]> {
		return this.conversations.filter(
			conversation => conversation.userId === userId,
		);
	}

	async findLatestOneByUserId(
		userId: string,
	): Promise<Conversation | undefined | null> {
		return this.conversations
			.reverse()
			.find(conversation => conversation.userId === userId);
	}

	async findLastTurnByConversationId(conversationId: number): Promise<number> {
		return this.questions.filter(
			question => question.conversationId === conversationId,
		).length;
	}

	async findQuestionsByConversationId(
		conversationId: number,
	): Promise<Question[]> {
		return this.questions.filter(
			question => question.conversationId === conversationId,
		);
	}

	async findAnswersByConversationId(conversationId: number): Promise<Answer[]> {
		return this.answers.filter(
			answer => answer.conversationId === conversationId,
		);
	}

	async findPairsByConversationTurn(
		conversationId: number,
		turn: number,
	): Promise<{
		question: Question | undefined | null;
		answer: Answer | undefined | null;
	}> {
		const answer = this.answers.find(
			answer =>
				answer.turn === turn && answer.conversationId === conversationId,
		);
		const question = this.questions.find(
			question =>
				question.turn === turn && question.conversationId === conversationId,
		);
		return { question, answer };
	}

	async update(conversation: Conversation): Promise<void> {
		const index = this.conversations.findIndex(
			conversation => conversation.id === conversation.id,
		);
		this.conversations[index] = conversation;
	}

	async delete(conversationId: number): Promise<void> {
		const index = this.conversations.findIndex(
			conversation => conversation.id === conversationId,
		);
		this.conversations.splice(index, 1);
	}

	async deleteTurn(conversationId: number, turn: number): Promise<void> {
		const index = this.questions.findIndex(
			question =>
				question.conversationId === conversationId && question.turn === turn,
		);
		this.questions.splice(index, 1);
	}
}
