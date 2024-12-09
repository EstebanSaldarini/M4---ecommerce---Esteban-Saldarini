import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity() // Indica que esta clase es una entidad y representa una tabla en la base de datos.
export class User {
  @PrimaryGeneratedColumn() // Columna de ID autogenerada
  id: number;

  @Column() // Columna para el nombre del usuario
  name: string;

  @Column() // Columna para el correo electrónico del usuario
  email: string;

  @Column() // Columna para la contraseña del usuario (ya está en el AuthService pero incluyo aquí por claridad)
  password: string;

  @Column({ default: 'user' }) // Columna para el rol del usuario, con valor por defecto 'user'
  role: string;
}


// @Entity(): Marca esta clase como una entidad, lo que indica que representará una tabla 
// en la base de datos.
// @PrimaryGeneratedColumn(): Define una columna de clave primaria que se genera automáticamente.
// @Column(): Indica una columna normal en la tabla, en este caso para name y email.