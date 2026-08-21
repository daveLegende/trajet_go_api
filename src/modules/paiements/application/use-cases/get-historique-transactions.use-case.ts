import { Injectable, Inject } from '@nestjs/common';
import {
  PORTEFEUILLE_REPOSITORY,
  PortefeuilleRepositoryInterface,
} from '../../domain/repositories/portefeuille.repository.interface';
import {
  TRANSACTION_REPOSITORY,
  TransactionRepositoryInterface,
} from '../../domain/repositories/transaction.repository.interface';
import { TransactionResponseDto } from '../dto/transaction-response.dto';

export interface HistoriqueResult {
  data: TransactionResponseDto[];
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class GetHistoriqueTransactionsUseCase {
  constructor(
    @Inject(PORTEFEUILLE_REPOSITORY)
    private readonly portefeuilleRepository: PortefeuilleRepositoryInterface,
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: TransactionRepositoryInterface,
  ) {}

  async execute(user_id: string, page = 1, limit = 20): Promise<HistoriqueResult> {
    const portefeuille = await this.portefeuilleRepository.findOrCreateByUserId(user_id);

    const { data, total } = await this.transactionRepository.findByPortefeuilleId(
      portefeuille.id,
      page,
      limit,
    );

    return {
      data: data.map(TransactionResponseDto.fromEntity),
      total,
      page,
      limit,
    };
  }
}
