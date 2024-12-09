import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserRole1732674755747 implements MigrationInterface {
    name = 'AddUserRole1732674755747'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Proporcionar un valor predeterminado temporal a las columnas que podrían tener valores NULL
        await queryRunner.query(`UPDATE "user" SET "name" = 'Unknown' WHERE "name" IS NULL`);
        await queryRunner.query(`UPDATE "user" SET "address" = '' WHERE "address" IS NULL`);
        await queryRunner.query(`UPDATE "user" SET "phone" = 0 WHERE "phone" IS NULL`);
        await queryRunner.query(`UPDATE "user" SET "country" = 'Unknown' WHERE "country" IS NULL`);
        await queryRunner.query(`UPDATE "user" SET "city" = 'Unknown' WHERE "city" IS NULL`);

        // Realizar cambios de esquema
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "address" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "phone" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "country" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "city" SET NOT NULL`);

        // Verificar si la columna "role" ya existe antes de agregarla
        const column = await queryRunner.query(`SELECT column_name FROM information_schema.columns WHERE table_name='user' AND column_name='role'`);
        if (column.length === 0) {
            await queryRunner.query(`ALTER TABLE "user" ADD "role" character varying(20) NOT NULL DEFAULT 'user'`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "city" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "country" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "phone" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "address" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "name" DROP NOT NULL`);
    }
}
