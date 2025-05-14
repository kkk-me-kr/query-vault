import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterQuestionAndAnswer1747243741512 implements MigrationInterface {
    name = 'AlterQuestionAndAnswer1747243741512'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`answers\` DROP COLUMN \`content\``);
        await queryRunner.query(`ALTER TABLE \`answers\` ADD \`content\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`questions\` DROP COLUMN \`content\``);
        await queryRunner.query(`ALTER TABLE \`questions\` ADD \`content\` text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`questions\` DROP COLUMN \`content\``);
        await queryRunner.query(`ALTER TABLE \`questions\` ADD \`content\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`answers\` DROP COLUMN \`content\``);
        await queryRunner.query(`ALTER TABLE \`answers\` ADD \`content\` varchar(255) NOT NULL`);
    }

}
