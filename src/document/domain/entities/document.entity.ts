import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'documents' })
export class Document {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'int', nullable: true })
	documentTypeId?: number | null;

	@Column()
	title: string;

	@Column({ type: 'text' })
	content: string;

	@Column()
	source: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
