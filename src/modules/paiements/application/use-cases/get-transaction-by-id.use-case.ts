import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import {
  PORTEFEUILLE_REPOSITORY,
  PortefeuilleRepositoryInterface,
} from '../../domain/repositories/portefeuille.repository.interface';
import {
  TRANSACTION_REPOSITORY,
  TransactionRepositoryInterface,
} from '../../domain/repositories/transaction.repository.interface';
import { TransactionResponseDto } from '../dto/transaction-response.dto';

@Injectable()
export class GetTransactionByIdUseCase {
  constructor(
    @Inject(PORTEFEUILLE_REPOSITORY)
    private readonly portefeuilleRepository: PortefeuilleRepositoryInterface,
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: TransactionRepositoryInterface,
  ) {}

  async execute(user_id: string, transaction_id: string): Promise<TransactionResponseDto> {
    const transaction = await this.transactionRepository.findById(transaction_id);
    if (!transaction) {
      throw new NotFoundException('Transaction introuvable');
    }

    // Vérifier que la transaction appartient au portefeuille de l'utilisateur
    const portefeuille = await this.portefeuilleRepository.findByUserId(user_id);
    if (!portefeuille || portefeuille.id !== transaction.portefeuille_id) {
      throw new ForbiddenException(
        'Vous ne pouvez consulter que vos propres transactions',
      );
    }

    return TransactionResponseDto.fromEntity(transaction);
  }
}
