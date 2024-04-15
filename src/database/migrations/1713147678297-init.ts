import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1713147678297 implements MigrationInterface {
    name = 'Init1713147678297'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "email" character varying NOT NULL, "password" character varying NOT NULL, "username" character varying, "name" character varying, "role" "public"."users_role_enum" NOT NULL DEFAULT '2', "refresh_token" text, "isVerified" boolean NOT NULL DEFAULT false, "verificationEmailToken" text, "isTwoFactorEnabled" boolean NOT NULL DEFAULT false, "twoFactorSecret" text, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }

}
