import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductTable1731776077920 implements MigrationInterface {
    name = 'CreateProductTable1731776077920';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Verificar y eliminar las tablas si ya existen antes de crearlas
        await queryRunner.query(`DROP TABLE IF EXISTS "order_detail" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "order" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "product" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "category" CASCADE`);

        // Crear las tablas necesarias
        await queryRunner.query(`
          CREATE TABLE "order" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "user_id" uuid,
            CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id")
          )
        `);

        await queryRunner.query(`
          CREATE TABLE "order_detail" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "price" numeric(10,2) NOT NULL,
            "quantity" integer NOT NULL,
            "orderId" uuid,
            "productId" uuid,
            CONSTRAINT "PK_0afbab1fa98e2fb0be8e74f6b38" PRIMARY KEY ("id")
          )
        `);

        await queryRunner.query(`
          CREATE TABLE "product" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "name" character varying(50) NOT NULL,
            "description" text NOT NULL,
            "price" numeric(10,2) NOT NULL,
            "stock" integer NOT NULL,
            "imgUrl" character varying DEFAULT 'path_to_default_image.jpg',
            "category_id" uuid,
            CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id")
          )
        `);

        await queryRunner.query(`
          CREATE TABLE "category" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "name" character varying(50) NOT NULL,
            CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id")
          )
        `);

        // Actualizar columnas existentes en la tabla `user`
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "password" character varying(20) NOT NULL DEFAULT 'default_password'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" DROP DEFAULT`);

        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "address" text DEFAULT ''`);

        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "phone" integer`);

        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "country"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "country" character varying(50)`);

        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "city"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "city" character varying(50)`);

        await queryRunner.query(`UPDATE "user" SET "name" = 'Anonymous' WHERE "name" IS NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "name" SET NOT NULL`);

        await queryRunner.query(`UPDATE "user" SET "email" = 'example@example.com' WHERE "email" IS NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "email" SET NOT NULL`);

        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")`);

        // Agregar la columna 'role'
        await queryRunner.query(`
          ALTER TABLE "user"
          ADD COLUMN "role" VARCHAR(255) NOT NULL DEFAULT 'user'
        `);

        // Agregar las restricciones de claves foráneas
        await queryRunner.query(`
          ALTER TABLE "order"
          ADD CONSTRAINT "FK_199e32a02ddc0f47cd93181d8fd" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
          ALTER TABLE "order_detail"
          ADD CONSTRAINT "FK_88850b85b38a8a2ded17a1f5369" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
          ALTER TABLE "order_detail"
          ADD CONSTRAINT "FK_a3647bd11aed3cf968c9ce9b835" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
          ALTER TABLE "product"
          ADD CONSTRAINT "FK_0dce9bc93c2d2c399982d04bef1" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revertir la columna 'role'
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);

        // Eliminar restricciones de claves foráneas
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_0dce9bc93c2d2c399982d04bef1"`);
        await queryRunner.query(`ALTER TABLE "order_detail" DROP CONSTRAINT "FK_a3647bd11aed3cf968c9ce9b835"`);
        await queryRunner.query(`ALTER TABLE "order_detail" DROP CONSTRAINT "FK_88850b85b38a8a2ded17a1f5369"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_199e32a02ddc0f47cd93181d8fd"`);

        // Eliminar tablas
        await queryRunner.query(`DROP TABLE IF EXISTS "category" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "product" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "order_detail" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "order" CASCADE`);
    }
}


