import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
	Conversation,
	ConversationStatus,
} from '@/conversation/domain/entities/conversation.entity';
import { Question } from '@/conversation/domain/entities/question.entity';
import { Answer } from '@/conversation/domain/entities/answer.entity';
import { ConversationRepository } from '@/conversation/domain/repository';

@Injectable()
export class ConversationTypeOrmRepository extends ConversationRepository {
	constructor(
		@InjectRepository(Conversation)
		private readonly conversationRepository: Repository<Conversation>,
		@InjectRepository(Question)
		private readonly questionRepository: Repository<Question>,
		@InjectRepository(Answer)
		private readonly answerRepository: Repository<Answer>,
	) {
		super();
	}

	async create(
		userId: string,
		status: ConversationStatus,
		title?: string,
	): Promise<void> {
		const conversation = new Conversation();
		conversation.userId = userId;
		conversation.status = status;
		conversation.title = title;
		await this.conversationRepository.save(conversation);
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
		await this.questionRepository.save(question);
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
		await this.answerRepository.save(answer);
	}

	async findById(
		conversationId: number,
	): Promise<Conversation | undefined | null> {
		return this.conversationRepository.findOne({
			where: { id: conversationId },
		});
	}

	async findByUserId(userId: string): Promise<Conversation[]> {
		return this.conversationRepository.find({ where: { userId } });
	}

	async findLatestOneByUserId(
		userId: string,
	): Promise<Conversation | undefined | null> {
		return this.conversationRepository.findOne({
			where: { userId },
			order: { id: 'DESC' },
		});
	}

	async findLastTurnByConversationId(conversationId: number): Promise<number> {
		const lastQuestion = await this.questionRepository.findOne({
			where: { conversationId },
			order: { turn: 'DESC' },
		});
		return lastQuestion?.turn ?? 0;
	}

	async findQuestionsByConversationId(
		conversationId: number,
	): Promise<Question[]> {
		return this.questionRepository.find({
			where: { conversationId },
			order: { turn: 'ASC' },
		});
	}

	async findAnswersByConversationId(conversationId: number): Promise<Answer[]> {
		return this.answerRepository.find({
			where: { conversationId },
		});
	}

	async findPairsByConversationTurn(
		conversationId: number,
		turn: number,
	): Promise<{
		question: Question | undefined | null;
		answer: Answer | undefined | null;
	}> {
		const question = await this.questionRepository.findOne({
			where: { conversationId, turn },
		});
		const answer = await this.answerRepository.findOne({
			where: { conversationId, turn },
		});
		return { question, answer };
	}

	async update(conversation: Conversation): Promise<void> {
		await this.conversationRepository.save(conversation);
	}

	async delete(conversationId: number): Promise<void> {
		await this.conversationRepository.delete(conversationId);
	}

	async deleteTurn(conversationId: number, turn: number): Promise<void> {
		await this.questionRepository.delete({ conversationId, turn });
		await this.answerRepository.delete({ conversationId });
	}
}
