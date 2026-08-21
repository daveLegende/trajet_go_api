import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import {
  PORTEFEUILLE_REPOSITORY,
  PortefeuilleRepositoryInterface,
} from '../../domain/repositories/portefeuille.repository.interface';
import {
  TRANSACTION_REPOSITORY,
  TransactionRepositoryInterface,
} from '../../domain/repositories/transaction.repository.interface';
import {
  PAYMENT_PROVIDER,
  PaymentProviderPort,
} from '../../domain/ports/paiement-provider.port';
import { TransactionStatus, TransactionType } from '../../domain/entities/transaction.entity';
import { CreditPortefeuilleDto } from '../dto/credit-portefeuille.dto';
import { TransactionResponseDto } from '../dto/transaction-response.dto';

@Injectable()
export class CreditPortefeuilleUseCase {
  constructor(
    @Inject(PORTEFEUILLE_REPOSITORY)
    private readonly portefeuilleRepository: PortefeuilleRepositoryInterface,
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: TransactionRepositoryInterface,
    @Inject(PAYMENT_PROVIDER)
    private readonly paymentProvider: PaymentProviderPort,
  ) {}

  async execute(user_id: string, dto: CreditPortefeuilleDto): Promise<TransactionResponseDto> {
    // Idempotence : si la clé existe déjà, on retourne la transaction existante
    const existingTransaction = await this.transactionRepository.findByIdempotenceKey(
      dto.cle_idempotence,
    );
    if (existingTransaction) {
      return TransactionResponseDto.fromEntity(existingTransaction);
    }

    // Récupérer ou créer le portefeuille
    const portefeuille = await this.portefeuilleRepository.findOrCreateByUserId(user_id);

    // Créer la transaction en attente
    const transaction = await this.transactionRepository.create({
      portefeuille_id: portefeuille.id,
      type: TransactionType.CREDIT,
      montant: dto.montant,
      statut: TransactionStatus.EN_ATTENTE,
      cle_idempotence: dto.cle_idempotence,
      description: `Recharge portefeuille — ${dto.montant} FCFA`,
    });

    // Appel au fournisseur de paiement (Mock pour l'instant)
    const result = await this.paymentProvider.initiatePayment({
      montant: dto.montant,
      telephone: user_id, // sera remplacé par le vrai numéro au branchement Mobile Money
      description: transaction.description ?? '',
      cle_idempotence: dto.cle_idempotence,
    });

    if (!result.success) {
      // Marquer la transaction en échec
      const failed = await this.transactionRepository.updateStatut(
        transaction.id,
        TransactionStatus.ECHEC,
      );
      throw new BadRequestException(result.message ?? 'Le paiement a échoué. Veuillez réessayer.');
    }

    // Créditer le portefeuille
    portefeuille.credit(dto.montant);
    await this.portefeuilleRepository.updateSolde(portefeuille.id, portefeuille.solde);

    // Marquer la transaction comme réussie
    const successTransaction = await this.transactionRepository.updateStatut(
      transaction.id,
      TransactionStatus.REUSSIE,
    );

    return TransactionResponseDto.fromEntity(successTransaction);
  }
}
