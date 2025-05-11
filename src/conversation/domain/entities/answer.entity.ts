import {
	Entity,
	Column,
	ManyToOne,
	JoinColumn,
	CreateDateColumn,
	UpdateDateColumn,
	PrimaryColumn,
} from 'typeorm';
import { Conversation } from './conversation.entity';

@Entity('answers')
export class Answer {
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

	@ManyToOne(() => Conversation, conversation => conversation.answers)
	@JoinColumn({ name: 'conversationId' })
	conversation: Conversation;
}
