import { Injectable, Inject } from '@nestjs/common';
import {
  PORTEFEUILLE_REPOSITORY,
  PortefeuilleRepositoryInterface,
} from '../../domain/repositories/portefeuille.repository.interface';
import { PortefeuilleResponseDto } from '../dto/portefeuille-response.dto';

@Injectable()
export class GetOrCreatePortefeuilleUseCase {
  constructor(
    @Inject(PORTEFEUILLE_REPOSITORY)
    private readonly portefeuilleRepository: PortefeuilleRepositoryInterface,
  ) {}

  async execute(user_id: string): Promise<PortefeuilleResponseDto> {
    const portefeuille = await this.portefeuilleRepository.findOrCreateByUserId(user_id);
    return PortefeuilleResponseDto.fromEntity(portefeuille);
  }
}
