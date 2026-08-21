import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  PORTEFEUILLE_REPOSITORY,
  PortefeuilleRepositoryInterface,
} from '../../domain/repositories/portefeuille.repository.interface';
import {
  TRANSACTION_REPOSITORY,
  TransactionRepositoryInterface,
} from '../../domain/repositories/transaction.repository.interface';
import { TransactionStatus, TransactionType } from '../../domain/entities/transaction.entity';
import { RemboursementDto } from '../dto/remboursement.dto';
import { TransactionResponseDto } from '../dto/transaction-response.dto';
import * as crypto from 'crypto';

@Injectable()
export class RemboursementUseCase {
  constructor(
    @Inject(PORTEFEUILLE_REPOSITORY)
    private readonly portefeuilleRepository: PortefeuilleRepositoryInterface,
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: TransactionRepositoryInterface,
  ) {}

  async execute(dto: RemboursementDto): Promise<TransactionResponseDto> {
    // Trouver la transaction originale
    const originalTransaction = await this.transactionRepository.findById(dto.transaction_id);
    if (!originalTransaction) {
      throw new NotFoundException('Transaction introuvable');
    }

    // Vérifier qu'elle est remboursable (doit être REUSSIE)
    if (originalTransaction.statut !== TransactionStatus.REUSSIE) {
      throw new BadRequestException(
        'Seules les transactions réussies peuvent être remboursées',
      );
    }

    // Vérifier qu'elle n'est pas déjà remboursée
    if (originalTransaction.type === TransactionType.REMBOURSEMENT) {
      throw new BadRequestException('Cette transaction est déjà un remboursement');
    }

    // Récupérer le portefeuille associé
    const portefeuille = await this.portefeuilleRepository.findByUserId(
      originalTransaction.portefeuille_id,
    );
    if (!portefeuille) {
      throw new NotFoundException('Portefeuille introuvable');
    }

    // Marquer la transaction originale comme remboursée
    await this.transactionRepository.updateStatut(
      originalTransaction.id,
      TransactionStatus.REMBOURSEE,
    );

    // Créditer le portefeuille
    portefeuille.credit(originalTransaction.montant);
    await this.portefeuilleRepository.updateSolde(portefeuille.id, portefeuille.solde);

    // Créer une transaction de remboursement
    const remboursement = await this.transactionRepository.create({
      portefeuille_id: portefeuille.id,
      reservation_id: originalTransaction.reservation_id,
      type: TransactionType.REMBOURSEMENT,
      montant: originalTransaction.montant,
      statut: TransactionStatus.REUSSIE,
      cle_idempotence: crypto.randomUUID(),
      description: dto.motif
        ? `Remboursement — ${dto.motif}`
        : `Remboursement transaction #${originalTransaction.id.substring(0, 8)}`,
    });

    return TransactionResponseDto.fromEntity(remboursement);
  }
}
