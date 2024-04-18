import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1713406657309 implements MigrationInterface {
  name = 'Init1713406657309';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('0', '1', '2')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT '962b86ef-49c1-48b3-8e82-96776fbe6247', "email" character varying NOT NULL, "phone" character varying, "passwordHash" character varying NOT NULL, "username" character varying, "fullName" character varying, "role" "public"."users_role_enum" NOT NULL DEFAULT '2', "refreshToken" text, "isEmailVerified" boolean NOT NULL DEFAULT false, "emailVerificationToken" text, "isTwoFactorAuthEnabled" boolean NOT NULL DEFAULT false, "twoFactorSecret" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "uuid" SET DEFAULT '047df416-e5a8-4058-995f-09f7a4dbd123'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "uuid" SET DEFAULT '962b86ef-49c1-48b3-8e82-96776fbe6247'`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
  }
}
