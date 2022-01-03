import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatedTourAndRenamedUserToAppUser1641134193218 implements MigrationInterface {
    name = 'CreatedTourAndRenamedUserToAppUser1641134193218'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pet" DROP CONSTRAINT "fk_user_pet"`);
        await queryRunner.query(`CREATE TYPE "public"."tour_difficulty_enum" AS ENUM('easy', 'medium', 'difficult')`);
        await queryRunner.query(`CREATE TABLE "tour" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(40) NOT NULL, "slugName" character varying NOT NULL, "duration" integer NOT NULL, "difficulty" "public"."tour_difficulty_enum" NOT NULL, "price" numeric NOT NULL, "isArchived" boolean NOT NULL DEFAULT false, "guideId" uuid, CONSTRAINT "UQ_948c1044932dba70d131655953d" UNIQUE ("name"), CONSTRAINT "tour_name_len" CHECK (char_length(name) >= 10 AND char_length(name) <= 40), CONSTRAINT "PK_972cd7fa4ec39286068130fa3f7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "app_user" ("id" uuid NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "username" character varying NOT NULL, CONSTRAINT "PK_22a5c4a3d9b2fb8e4e73fc4ada1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "pet" DROP CONSTRAINT "PK_b1ac2e88e89b9480e0c5b53fa60"`);
        await queryRunner.query(`ALTER TABLE "pet" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "pet" ADD "id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pet" ADD CONSTRAINT "PK_b1ac2e88e89b9480e0c5b53fa60" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "pet" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "pet" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pet" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "pet" ADD "user_id" uuid`);
        await queryRunner.query(`ALTER TABLE "pet" ADD CONSTRAINT "FK_64704296b7bd17e90ca0a620a98" FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tour" ADD CONSTRAINT "FK_110c5c3c68a047a899ace93a60e" FOREIGN KEY ("guideId") REFERENCES "app_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tour" DROP CONSTRAINT "FK_110c5c3c68a047a899ace93a60e"`);
        await queryRunner.query(`ALTER TABLE "pet" DROP CONSTRAINT "FK_64704296b7bd17e90ca0a620a98"`);
        await queryRunner.query(`ALTER TABLE "pet" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "pet" ADD "user_id" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "pet" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "pet" ADD "name" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pet" DROP CONSTRAINT "PK_b1ac2e88e89b9480e0c5b53fa60"`);
        await queryRunner.query(`ALTER TABLE "pet" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "pet" ADD "id" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pet" ADD CONSTRAINT "PK_b1ac2e88e89b9480e0c5b53fa60" PRIMARY KEY ("id")`);
        await queryRunner.query(`DROP TABLE "app_user"`);
        await queryRunner.query(`DROP TABLE "tour"`);
        await queryRunner.query(`DROP TYPE "public"."tour_difficulty_enum"`);
        await queryRunner.query(`ALTER TABLE "pet" ADD CONSTRAINT "fk_user_pet" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
