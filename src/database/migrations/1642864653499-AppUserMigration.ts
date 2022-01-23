import { MigrationInterface, QueryRunner } from 'typeorm';

export class AppUserMigration1642864653499 implements MigrationInterface {
  name = 'AppUserMigration1642864653499';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`app_user\`
      (
        \`id\` varchar(255) NOT NULL,
        \`first_name\` varchar(255) NOT NULL,
        \`last_name\` varchar(255) NOT NULL,
        \`address\` varchar(255) NOT NULL,
        \`postCode\` varchar(255) NOT NULL,
        \`contactNo\` varchar(255) NOT NULL,
        \`email\` varchar(255) NOT NULL,
        \`username\` varchar(255) NOT NULL,
        \`password\` varchar(255) NOT NULL,
        UNIQUE INDEX \`IDX_c480e576dd71729addbc2d51b6\` (\`username\`),
        PRIMARY KEY (\`id\`)
      )
      ENGINE=InnoDB`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`IDX_c480e576dd71729addbc2d51b6\` ON \`app_user\``);
    await queryRunner.query(`DROP TABLE \`app_user\``);
  }
}
