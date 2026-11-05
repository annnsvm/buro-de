import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length, Matches, MinLength } from "class-validator";

export class ResetPasswordDto {
  @ApiProperty({ example: "anna@example.com", description: "Email акаунта" })
  @IsEmail({}, { message: "Вкажіть коректну email-адресу" })
  email!: string;

  @ApiProperty({ example: "482915", description: "Код із листа, 6 цифр" })
  @IsString()
  @Length(6, 6, { message: "Код складається з 6 цифр" })
  code!: string;

  /** The same rule registration uses, so a reset cannot set a password signup would refuse. */
  @ApiProperty({
    example: "NewSecure2",
    description: "Новий пароль: мін. 9 символів, 1 велика літера, 1 цифра",
    minLength: 9,
  })
  @IsString()
  @MinLength(9, { message: "Password must be at least 9 characters" })
  @Matches(/(?=.*[A-Z])/, {
    message: "Password must contain at least one uppercase letter",
  })
  @Matches(/(?=.*[0-9])/, {
    message: "Password must contain at least one digit",
  })
  new_password!: string;
}
