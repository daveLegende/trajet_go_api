import { Inject, Injectable } from '@nestjs/common';
import { TrajetRepositoryInterface, TRAJET_REPOSITORY } from '../../domain/repositories/trajet.repository.interface';
import { TrajetMapper } from '../../infrastructure/mappers/trajet.mapper';
import { TrajetResponseDto } from '../dto/trajet-response.dto';

@Injectable()
export class ListTrajetsUseCase {
  constructor(
    @Inject(TRAJET_REPOSITORY)
    private readonly trajetRepository: TrajetRepositoryInterface,
  ) {}

  async execute(filters?: {
    ville_depart?: string;
    ville_arrivee?: string;
    date_depart?: Date;
    places_disponibles?: number;
  }): Promise<TrajetResponseDto[]> {
    const trajets = await this.trajetRepository.findMany(filters);
    return trajets.map((trajet) => TrajetMapper.toResponseDto(trajet));
  }
}
