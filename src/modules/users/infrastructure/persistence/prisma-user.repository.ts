import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';
import { UserEntity } from '../../domain/entities/user.entity';
import {
  CreateUserData,
  UserRepositoryInterface,
} from '../../domain/repositories/user.repository.interface';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class PrismaUserRepository implements UserRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<UserEntity | null> {
    const raw = await this.prisma.user.findUnique({
      where: { id },
    });
    return raw ? UserMapper.toDomain(raw) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const raw = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
    return raw ? UserMapper.toDomain(raw) : null;
  }

  async findByPhone(phone: string): Promise<UserEntity | null> {
    const raw = await this.prisma.user.findUnique({
      where: { telephone: phone.trim() },
    });
    return raw ? UserMapper.toDomain(raw) : null;
  }

  async findByEmailOrPhone(emailOrPhone: string): Promise<UserEntity | null> {
    const clean = emailOrPhone.trim();
    const raw = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: clean.toLowerCase() },
          { telephone: clean },
        ],
      },
    });
    return raw ? UserMapper.toDomain(raw) : null;
  }

  async create(data: CreateUserData): Promise<UserEntity> {
    const raw = await this.prisma.user.create({
      data: {
        nom: data.nom.trim(),
        prenom: data.prenom.trim(),
        email: data.email.toLowerCase().trim(),
        telephone: data.telephone.trim(),
        mot_de_passe_hash: data.mot_de_passe_hash,
        date_naissance: data.date_naissance ?? null,
        photo_profil_url: data.photo_profil_url ?? null,
        type_utilisateur: (data.type_utilisateur as any) ?? 'PASSAGER',
        statut_verification: (data.statut_verification as any) ?? 'NON_VERIFIE',
        langue_preferee: data.langue_preferee ?? 'fr',
      },
    });
    return UserMapper.toDomain(raw);
  }

  async update(id: string, data: Partial<UserEntity>): Promise<UserEntity> {
    const updateData: any = { ...data };
    delete updateData.id;
    delete updateData.date_creation;

    const raw = await this.prisma.user.update({
      where: { id },
      data: updateData,
    });
    return UserMapper.toDomain(raw);
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { date_derniere_connexion: new Date() },
    });
  }

  async updateLastLogout(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { date_derniere_deconnexion: new Date() } as any,
    });
  }
}
