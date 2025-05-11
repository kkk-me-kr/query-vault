const STATUSES = { ACTIVE: 'ACTIVE', ARCHIVED: 'ARCHIVED', DELETED: 'DELETED' };
export type ConversationStatus = keyof typeof STATUSES;

export class Conversation {
	id?: number;
	userId: string;
	title?: string;
	status: ConversationStatus;
	createdAt?: Date;
	updatedAt?: Date;
}
