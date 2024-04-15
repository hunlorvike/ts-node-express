import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDb1713183429861 implements MigrationInterface {
    name = 'InitDb1713183429861'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "phone" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
    }

}
