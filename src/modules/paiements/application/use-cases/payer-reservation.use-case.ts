import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import {
  PORTEFEUILLE_REPOSITORY,
  PortefeuilleRepositoryInterface,
} from '../../domain/repositories/portefeuille.repository.interface';
import {
  TRANSACTION_REPOSITORY,
  TransactionRepositoryInterface,
} from '../../domain/repositories/transaction.repository.interface';
import {
  RESERVATION_REPOSITORY,
  ReservationRepositoryInterface,
} from '../../../reservations/domain/repositories/reservation.repository.interface';
import { TransactionStatus, TransactionType } from '../../domain/entities/transaction.entity';
import { PayerReservationDto } from '../dto/payer-reservation.dto';
import { TransactionResponseDto } from '../dto/transaction-response.dto';

@Injectable()
export class PayerReservationUseCase {
  constructor(
    @Inject(PORTEFEUILLE_REPOSITORY)
    private readonly portefeuilleRepository: PortefeuilleRepositoryInterface,
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: TransactionRepositoryInterface,
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepository: ReservationRepositoryInterface,
  ) {}

  async execute(user_id: string, dto: PayerReservationDto): Promise<TransactionResponseDto> {
    // Idempotence
    const existingTransaction = await this.transactionRepository.findByIdempotenceKey(
      dto.cle_idempotence,
    );
    if (existingTransaction) {
      return TransactionResponseDto.fromEntity(existingTransaction);
    }

    // Vérifier que la réservation existe et appartient au passager
    const reservation = await this.reservationRepository.findById(dto.reservation_id);
    if (!reservation) {
      throw new NotFoundException('Réservation introuvable');
    }
    if (reservation.passager_id !== user_id) {
      throw new ForbiddenException(
        'Vous ne pouvez payer que vos propres réservations',
      );
    }

    // Récupérer le portefeuille
    const portefeuille = await this.portefeuilleRepository.findOrCreateByUserId(user_id);
    const montant = reservation.montant_total;

    // Vérifier le solde
    if (portefeuille.solde < montant) {
      throw new BadRequestException(
        `Solde insuffisant. Solde disponible : ${portefeuille.solde} FCFA, montant requis : ${montant} FCFA`,
      );
    }

    // Débiter le portefeuille
    portefeuille.debit(montant);
    await this.portefeuilleRepository.updateSolde(portefeuille.id, portefeuille.solde);

    // Enregistrer la transaction
    const transaction = await this.transactionRepository.create({
      portefeuille_id: portefeuille.id,
      reservation_id: reservation.id,
      type: TransactionType.PAIEMENT_RESERVATION,
      montant,
      statut: TransactionStatus.REUSSIE,
      cle_idempotence: dto.cle_idempotence,
      description: `Paiement réservation #${reservation.id.substring(0, 8)}`,
    });

    return TransactionResponseDto.fromEntity(transaction);
  }
}
