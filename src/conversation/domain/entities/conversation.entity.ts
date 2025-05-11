import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToMany,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Question } from './question.entity';
import { Answer } from './answer.entity';

const STATUSES = { ACTIVE: 'ACTIVE', ARCHIVED: 'ARCHIVED', DELETED: 'DELETED' };
export type ConversationStatus = keyof typeof STATUSES;

@Entity('conversations')
export class Conversation {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	userId: string;

	@Column({ nullable: true })
	title?: string;

	@Column({ type: 'enum', enum: STATUSES })
	status: ConversationStatus;

	@CreateDateColumn()
	createdAt?: Date;
	@UpdateDateColumn()
	updatedAt?: Date;

	@OneToMany(() => Question, question => question.conversation)
	questions: Question[];

	@OneToMany(() => Answer, answer => answer.conversation)
	answers: Answer[];
}
