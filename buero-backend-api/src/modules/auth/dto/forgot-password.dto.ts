import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsIn, IsOptional } from "class-validator";

export class ForgotPasswordDto {
  @ApiProperty({ example: "anna@example.com", description: "Email акаунта" })
  @IsEmail({}, { message: "Вкажіть коректну email-адресу" })
  email!: string;

  @ApiPropertyOptional({
    enum: ["uk", "en"],
    description: "Мова листа з кодом",
  })
  @IsOptional()
  @IsIn(["uk", "en"])
  locale?: "uk" | "en";
}
