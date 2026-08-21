import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserType } from '../../../users/domain/entities/user.entity';
import {
  VEHICULE_REPOSITORY,
  VehiculeRepositoryInterface,
} from '../../domain/repositories/vehicule.repository.interface';

@Injectable()
export class DeleteVehiculeUseCase {
  constructor(
    @Inject(VEHICULE_REPOSITORY)
    private readonly vehiculeRepository: VehiculeRepositoryInterface,
  ) {}

  async execute(
    vehiculeId: string,
    requesterId: string,
    requesterRole: string,
  ): Promise<void> {
    const vehicule = await this.vehiculeRepository.findById(vehiculeId);
    if (!vehicule) {
      throw new NotFoundException(`Véhicule "${vehiculeId}" introuvable.`);
    }

    const isAdmin = requesterRole === UserType.ADMIN;
    const isOwner = vehicule.proprietaire_id === requesterId;

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException('Vous ne pouvez supprimer que vos propres véhicules.');
    }

    await this.vehiculeRepository.delete(vehiculeId);
  }
}
