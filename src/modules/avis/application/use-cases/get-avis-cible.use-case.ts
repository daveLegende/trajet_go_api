import { Injectable, Inject } from '@nestjs/common';
import { AVIS_REPOSITORY, AvisRepositoryInterface } from '../../domain/repositories/avis.repository.interface';
import { AvisResponseDto } from '../dto/avis-response.dto';

export interface AvisPagineResult {
  data: AvisResponseDto[];
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class GetAvisCibleUseCase {
  constructor(
    @Inject(AVIS_REPOSITORY)
    private readonly avisRepository: AvisRepositoryInterface,
  ) {}

  async execute(cible_id: string, page = 1, limit = 10): Promise<AvisPagineResult> {
    const { data, total } = await this.avisRepository.findByCibleId(cible_id, page, limit);

    return {
      data: data.map(AvisResponseDto.fromEntity),
      total,
      page,
      limit,
    };
  }
}
