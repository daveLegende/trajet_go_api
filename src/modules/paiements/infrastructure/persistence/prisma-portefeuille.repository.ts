import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';
import { PortefeuilleRepositoryInterface } from '../../domain/repositories/portefeuille.repository.interface';
import { PortefeuilleEntity } from '../../domain/entities/portefeuille.entity';
import { PortefeuilleMapper } from '../mappers/portefeuille.mapper';

@Injectable()
export class PrismaPortefeuilleRepository implements PortefeuilleRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(user_id: string): Promise<PortefeuilleEntity | null> {
    const portefeuille = await this.prisma.portefeuille.findUnique({
      where: { user_id },
    });
    return portefeuille ? PortefeuilleMapper.toDomain(portefeuille) : null;
  }

  async findOrCreateByUserId(user_id: string): Promise<PortefeuilleEntity> {
    const existing = await this.prisma.portefeuille.findUnique({
      where: { user_id },
    });
    if (existing) {
      return PortefeuilleMapper.toDomain(existing);
    }

    const created = await this.prisma.portefeuille.create({
      data: { user_id, solde: 0 },
    });
    return PortefeuilleMapper.toDomain(created);
  }

  async updateSolde(id: string, newSolde: number): Promise<PortefeuilleEntity> {
    const updated = await this.prisma.portefeuille.update({
      where: { id },
      data: { solde: newSolde },
    });
    return PortefeuilleMapper.toDomain(updated);
  }

  async save(data: { user_id: string }): Promise<PortefeuilleEntity> {
    const created = await this.prisma.portefeuille.create({
      data: { user_id: data.user_id, solde: 0 },
    });
    return PortefeuilleMapper.toDomain(created);
  }
}
