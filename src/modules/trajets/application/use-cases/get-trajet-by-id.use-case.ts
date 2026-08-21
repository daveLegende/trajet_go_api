import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TrajetRepositoryInterface, TRAJET_REPOSITORY } from '../../domain/repositories/trajet.repository.interface';
import { TrajetMapper } from '../../infrastructure/mappers/trajet.mapper';
import { TrajetResponseDto } from '../dto/trajet-response.dto';

@Injectable()
export class GetTrajetByIdUseCase {
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
      throw new ForbiddenException('Vous ne pouvez voir que vos trajets ou ceux d’un admin.');
    }

    return TrajetMapper.toResponseDto(trajet);
  }
}
