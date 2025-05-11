import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	ManyToOne,
	JoinColumn,
	CreateDateColumn,
	UpdateDateColumn,
	PrimaryColumn,
} from 'typeorm';
import { Conversation } from './conversation.entity';

@Entity('questions')
export class Question {
	@PrimaryColumn()
	conversationId: number;

	@PrimaryColumn()
	turn: number;

	@Column()
	content: string;

	@CreateDateColumn()
	createdAt?: Date;
	@UpdateDateColumn()
	updatedAt?: Date;

	@ManyToOne(() => Conversation, conversation => conversation.questions)
	@JoinColumn({ name: 'conversationId' })
	conversation: Conversation;
}
