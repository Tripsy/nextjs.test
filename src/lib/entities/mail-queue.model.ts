export enum LogLevelEnum {
	TRACE = 'trace', // 10
	DEBUG = 'debug', // 20
	INFO = 'info', // 30
	WARN = 'warn', // 40
	ERROR = 'error', // 50
	FATAL = 'fatal', // 60
}

export enum LogCategoryEnum {
	SYSTEM = 'system',
	HISTORY = 'history',
	CRON = 'cron',
	INFO = 'info',
	ERROR = 'error',
}

export type LogDataModel<D = Date | string> = {
	id: number;
	pid: string;
	category: LogCategoryEnum;
	level: LogLevelEnum;
	message: string;
	context: string;
	debugStack: string;
	created_at: D;
};

import type Mail from 'nodemailer/lib/mailer';
import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { MailQueueStatusEnum } from '../enums/mail-queue-status.enum';
import type { EmailContent } from '../types/template.type';

@Entity('mail_queue')
export default class MailQueueEntity {
	@PrimaryGeneratedColumn({ type: 'bigint', unsigned: false })
	id!: number;

	@Index('IDX_mail_queue_template_id', { unique: false })
	@Column({ type: 'bigint', unsigned: false, nullable: true })
	template_id?: number | null;

	@Column('char', { length: 2, nullable: false })
	language!: string;

	@Column({
		type: 'json',
		nullable: false,
		comment: 'Email content: subject, text, html, vars, layout',
	})
	content!: EmailContent;

	@Column({ type: 'json', nullable: false, comment: 'To: name & address' })
	to!: Mail.Address;

	@Column({ type: 'json', nullable: true, comment: 'From: name & address' })
	from?: Mail.Address;

	@Index('IDX_mail_queue_status', { unique: false })
	@Column({
		type: 'enum',
		enum: MailQueueStatusEnum,
		default: MailQueueStatusEnum.PENDING,
		nullable: false,
	})
	status!: MailQueueStatusEnum;

	@Column('text', { nullable: true })
	error?: string | null;

	@Index('IDX_mail_queue_sent_at', { unique: false })
	@Column({ type: 'timestamp', nullable: true })
	sent_at?: Date;

	@CreateDateColumn({ type: 'timestamp', nullable: false })
	created_at!: Date;

	@UpdateDateColumn({ type: 'timestamp', nullable: true })
	updated_at?: Date;
}
