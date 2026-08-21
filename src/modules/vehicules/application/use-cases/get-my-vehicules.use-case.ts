import { Inject, Injectable } from '@nestjs/common';
import {
  VEHICULE_REPOSITORY,
  VehiculeRepositoryInterface,
} from '../../domain/repositories/vehicule.repository.interface';
import { VehiculeMapper } from '../../infrastructure/mappers/vehicule.mapper';
import { VehiculeResponseDto } from '../dto/vehicule-response.dto';

@Injectable()
export class GetMyVehiculesUseCase {
  constructor(
    @Inject(VEHICULE_REPOSITORY)
    private readonly vehiculeRepository: VehiculeRepositoryInterface,
  ) {}

  async execute(proprietaireId: string): Promise<VehiculeResponseDto[]> {
    const vehicules = await this.vehiculeRepository.findByProprietaireId(proprietaireId);
    return vehicules.map((v) => VehiculeMapper.toResponseDto(v));
  }
}
