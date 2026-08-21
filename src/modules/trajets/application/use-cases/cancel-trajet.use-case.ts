import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TrajetStatus } from '../../domain/entities/trajet.entity';
import { TrajetRepositoryInterface, TRAJET_REPOSITORY } from '../../domain/repositories/trajet.repository.interface';
import { TrajetMapper } from '../../infrastructure/mappers/trajet.mapper';
import { TrajetResponseDto } from '../dto/trajet-response.dto';

@Injectable()
export class CancelTrajetUseCase {
  constructor(
    @Inject(TRAJET_REPOSITORY)
    private readonly trajetRepository: TrajetRepositoryInterface,
  ) {}

  async execute(trajetId: string, requesterId: string, role?: string): Promise<TrajetResponseDto> {
    const trajet = await this.trajetRepository.findById(trajetId);
    if (!trajet) {
      throw new NotFoundException('Trajet introuvable.');
    }

    if (trajet.conducteur_id !== requesterId && role !== 'ADMIN') {
      throw new ForbiddenException('Vous ne pouvez annuler que vos propres trajets.');
    }

    const updated = await this.trajetRepository.update(trajetId, {
      statut: TrajetStatus.ANNULE,
    });

    return TrajetMapper.toResponseDto(updated);
  }
}
