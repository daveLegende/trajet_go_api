import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({
    example: '+22890123456',
    description: 'Numéro de téléphone au format international ou adresse email',
  })
  @IsString()
  @IsNotEmpty({ message: 'Le destinataire (téléphone ou email) est obligatoire' })
  @Matches(/^(\+[1-9]\d{7,14}|[^\s@]+@[^\s@]+\.[^\s@]+)$/, {
    message:
      'La cible doit être un numéro de téléphone international (+228XXXXXXXX) ou un email valide',
  })
  cible!: string;

  @ApiProperty({
    example: '1234',
    description: 'Code OTP à 4 chiffres',
  })
  @IsString()
  @IsNotEmpty({ message: 'Le code OTP est obligatoire' })
  @Matches(/^\d{4}$/, {
    message: 'Le code OTP doit être composé d’exactement 4 chiffres',
  })
  code!: string;
}
