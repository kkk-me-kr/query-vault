import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateConversation1746991655592 implements MigrationInterface {
    name = 'CreateConversation1746991655592'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`answers\` (\`conversationId\` int NOT NULL, \`turn\` int NOT NULL, \`content\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`conversationId\`, \`turn\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`conversations\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` varchar(255) NOT NULL, \`title\` varchar(255) NULL, \`status\` enum ('ACTIVE', 'ARCHIVED', 'DELETED') NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`questions\` (\`conversationId\` int NOT NULL, \`turn\` int NOT NULL, \`content\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`conversationId\`, \`turn\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`answers\` ADD CONSTRAINT \`FK_f3856704fb291c988368729d178\` FOREIGN KEY (\`conversationId\`) REFERENCES \`conversations\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`questions\` ADD CONSTRAINT \`FK_c639875d6001324af33a22aff57\` FOREIGN KEY (\`conversationId\`) REFERENCES \`conversations\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`questions\` DROP FOREIGN KEY \`FK_c639875d6001324af33a22aff57\``);
        await queryRunner.query(`ALTER TABLE \`answers\` DROP FOREIGN KEY \`FK_f3856704fb291c988368729d178\``);
        await queryRunner.query(`DROP TABLE \`questions\``);
        await queryRunner.query(`DROP TABLE \`conversations\``);
        await queryRunner.query(`DROP TABLE \`answers\``);
    }

}
