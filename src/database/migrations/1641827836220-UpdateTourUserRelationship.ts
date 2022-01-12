import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateTourUserRelationship1641827836220 implements MigrationInterface {
    name = 'UpdateTourUserRelationship1641827836220'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tour" DROP CONSTRAINT "FK_110c5c3c68a047a899ace93a60e"`);
        await queryRunner.query(`ALTER TABLE "tour" RENAME COLUMN "guideId" TO "guide_id"`);
        await queryRunner.query(`ALTER TABLE "tour" ALTER COLUMN "guide_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tour" ADD CONSTRAINT "FK_f9c8da0f4bf8e4af264b8b40974" FOREIGN KEY ("guide_id") REFERENCES "app_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tour" DROP CONSTRAINT "FK_f9c8da0f4bf8e4af264b8b40974"`);
        await queryRunner.query(`ALTER TABLE "tour" ALTER COLUMN "guide_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tour" RENAME COLUMN "guide_id" TO "guideId"`);
        await queryRunner.query(`ALTER TABLE "tour" ADD CONSTRAINT "FK_110c5c3c68a047a899ace93a60e" FOREIGN KEY ("guideId") REFERENCES "app_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
