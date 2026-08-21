import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';
import { VehiculeEntity } from '../../domain/entities/vehicule.entity';
import {
  CreateVehiculeData,
  UpdateVehiculeData,
  VehiculeRepositoryInterface,
} from '../../domain/repositories/vehicule.repository.interface';
import { VehiculeMapper } from '../mappers/vehicule.mapper';

@Injectable()
export class PrismaVehiculeRepository implements VehiculeRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateVehiculeData): Promise<VehiculeEntity> {
    const record = await (this.prisma as any).vehicule.create({
      data: {
        proprietaire_id: data.proprietaire_id,
        marque: data.marque,
        modele: data.modele,
        couleur: data.couleur,
        immatriculation: data.immatriculation,
        nombre_places: data.nombre_places,
        annee: data.annee,
        carte_grise_url: data.carte_grise_url ?? null,
        assurance_url: data.assurance_url ?? null,
        date_expiration_assurance: data.date_expiration_assurance ?? null,
        photos: data.photos ?? [],
      },
    });
    return VehiculeMapper.toDomain(record);
  }

  async findById(id: string): Promise<VehiculeEntity | null> {
    const record = await (this.prisma as any).vehicule.findUnique({
      where: { id },
    });
    return record ? VehiculeMapper.toDomain(record) : null;
  }

  async findByImmatriculation(immatriculation: string): Promise<VehiculeEntity | null> {
    const record = await (this.prisma as any).vehicule.findUnique({
      where: { immatriculation },
    });
    return record ? VehiculeMapper.toDomain(record) : null;
  }

  async findByProprietaireId(proprietaireId: string): Promise<VehiculeEntity[]> {
    const records = await (this.prisma as any).vehicule.findMany({
      where: { proprietaire_id: proprietaireId },
      orderBy: { date_creation: 'desc' },
    });
    return records.map((r: any) => VehiculeMapper.toDomain(r));
  }

  async update(id: string, data: UpdateVehiculeData): Promise<VehiculeEntity> {
    const record = await (this.prisma as any).vehicule.update({
      where: { id },
      data,
    });
    return VehiculeMapper.toDomain(record);
  }

  async delete(id: string): Promise<void> {
    await (this.prisma as any).vehicule.delete({
      where: { id },
    });
  }
}
