import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserType } from '../../../users/domain/entities/user.entity';

export class RegisterDto {
  @ApiProperty({ example: 'Koffi', description: 'Nom de famille' })
  @IsString()
  @IsNotEmpty({ message: 'Le nom est obligatoire' })
  @MinLength(2, { message: 'Le nom doit contenir au moins 2 caractères' })
  @MaxLength(50, { message: 'Le nom ne peut pas dépasser 50 caractères' })
  nom!: string;

  @ApiProperty({ example: 'Abalo', description: 'Prénom(s)' })
  @IsString()
  @IsNotEmpty({ message: 'Le prénom est obligatoire' })
  @MinLength(2, { message: 'Le prénom doit contenir au moins 2 caractères' })
  @MaxLength(50, { message: 'Le prénom ne peut pas dépasser 50 caractères' })
  prenom!: string;

  @ApiProperty({
    example: 'koffi.abalo@example.com',
    description: 'Adresse email unique',
  })
  @IsEmail({}, { message: 'L’adresse email n’est pas valide' })
  @IsNotEmpty({ message: 'L’email est obligatoire' })
  email!: string;

  @ApiProperty({
    example: '+22890123456',
    description: 'Numéro de téléphone au format international (E.164)',
  })
  @IsString()
  @IsNotEmpty({ message: 'Le numéro de téléphone est obligatoire' })
  @Matches(/^\+[1-9]\d{7,14}$/, {
    message:
      'Le numéro de téléphone doit être au format international (ex: +22890123456)',
  })
  telephone!: string;

  @ApiProperty({
    example: 'MotDePasseFort123!',
    description: 'Mot de passe sécurisé (min 8 caractères)',
  })
  @IsString()
  @MinLength(8, {
    message: 'Le mot de passe doit contenir au moins 8 caractères',
  })
  @MaxLength(100, {
    message: 'Le mot de passe ne peut pas dépasser 100 caractères',
  })
  mot_de_passe!: string;

  @ApiPropertyOptional({
    enum: UserType,
    example: UserType.PASSAGER,
    description: 'Type d’utilisateur (passager par défaut)',
  })
  @IsEnum(UserType, { message: 'Type d’utilisateur invalide' })
  @IsOptional()
  type_utilisateur?: UserType = UserType.PASSAGER;

  @ApiPropertyOptional({
    example: '1995-05-15',
    description: 'Date de naissance (format ISO AAAA-MM-JJ)',
  })
  @IsDateString({}, { message: 'Format de date invalide (AAAA-MM-JJ)' })
  @IsOptional()
  date_naissance?: string;

  @ApiPropertyOptional({
    example: 'https://cdn.trajetgo.tg/profiles/photo.jpg',
    description: 'URL de la photo de profil',
  })
  @IsUrl({}, { message: 'L’URL de photo de profil n’est pas valide' })
  @IsOptional()
  photo_profil_url?: string;

  @ApiPropertyOptional({ example: 'fr', description: 'Langue préférée' })
  @IsString()
  @IsOptional()
  langue_preferee?: string = 'fr';
}
