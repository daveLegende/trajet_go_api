import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PayerReservationUseCase } from './payer-reservation.use-case';
import { PortefeuilleRepositoryInterface } from '../../domain/repositories/portefeuille.repository.interface';
import { TransactionRepositoryInterface } from '../../domain/repositories/transaction.repository.interface';
import { ReservationRepositoryInterface } from '../../../reservations/domain/repositories/reservation.repository.interface';
import { PortefeuilleEntity } from '../../domain/entities/portefeuille.entity';
import { TransactionEntity, TransactionStatus, TransactionType } from '../../domain/entities/transaction.entity';
import { ReservationEntity, StatutReservation } from '../../../reservations/domain/entities/reservation.entity';

describe('PayerReservationUseCase', () => {
  let useCase: PayerReservationUseCase;
  let portefeuilleRepository: jest.Mocked<PortefeuilleRepositoryInterface>;
  let transactionRepository: jest.Mocked<TransactionRepositoryInterface>;
  let reservationRepository: jest.Mocked<ReservationRepositoryInterface>;

  const mockPortefeuille = new PortefeuilleEntity({
    id: 'wallet-1',
    user_id: 'user-1',
    solde: 10000,
    date_creation: new Date(),
    date_mise_a_jour: new Date(),
  });

  const mockReservation = new ReservationEntity({
    id: 'resa-1',
    trajet_id: 'trajet-1',
    passager_id: 'user-1',
    statut: StatutReservation.ACCEPTEE,
    places_reservees: 1,
    montant_total: 3000,
    date_creation: new Date(),
    date_mise_a_jour: new Date(),
  });

  const mockTransaction = new TransactionEntity({
    id: 'tx-1',
    portefeuille_id: 'wallet-1',
    reservation_id: 'resa-1',
    type: TransactionType.PAIEMENT_RESERVATION,
    montant: 3000,
    statut: TransactionStatus.REUSSIE,
    cle_idempotence: 'idem-key-pay',
    description: 'Paiement réservation',
    date_creation: new Date(),
    date_mise_a_jour: new Date(),
  });

  beforeEach(() => {
    portefeuilleRepository = {
      findByUserId: jest.fn(),
      findOrCreateByUserId: jest.fn().mockResolvedValue(new PortefeuilleEntity({ ...mockPortefeuille })),
      updateSolde: jest.fn().mockResolvedValue(mockPortefeuille),
      save: jest.fn(),
    };

    transactionRepository = {
      create: jest.fn().mockResolvedValue(mockTransaction),
      findById: jest.fn(),
      findByPortefeuilleId: jest.fn(),
      findByIdempotenceKey: jest.fn().mockResolvedValue(null),
      updateStatut: jest.fn(),
    };

    reservationRepository = {
      create: jest.fn(),
      findById: jest.fn().mockResolvedValue(mockReservation),
      updateStatut: jest.fn(),
      findByPassagerId: jest.fn(),
      findByTrajetId: jest.fn(),
    };

    useCase = new PayerReservationUseCase(
      portefeuilleRepository,
      transactionRepository,
      reservationRepository,
    );
  });

  it('should pay reservation successfully', async () => {
    const result = await useCase.execute('user-1', {
      reservation_id: 'resa-1',
      cle_idempotence: 'idem-key-pay',
    });

    expect(portefeuilleRepository.updateSolde).toHaveBeenCalledWith('wallet-1', 7000);
    expect(transactionRepository.create).toHaveBeenCalledTimes(1);
    expect(result.type).toBe(TransactionType.PAIEMENT_RESERVATION);
    expect(result.montant).toBe(3000);
  });

  it('should return existing transaction for same idempotence key', async () => {
    transactionRepository.findByIdempotenceKey.mockResolvedValue(mockTransaction);

    const result = await useCase.execute('user-1', {
      reservation_id: 'resa-1',
      cle_idempotence: 'idem-key-pay',
    });

    expect(reservationRepository.findById).not.toHaveBeenCalled();
    expect(result.id).toBe('tx-1');
  });

  it('should throw NotFoundException if reservation does not exist', async () => {
    reservationRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute('user-1', { reservation_id: 'resa-missing', cle_idempotence: 'idem-1' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw ForbiddenException if reservation belongs to another user', async () => {
    const otherReservation = new ReservationEntity({ ...mockReservation, passager_id: 'user-other' });
    reservationRepository.findById.mockResolvedValue(otherReservation);

    await expect(
      useCase.execute('user-1', { reservation_id: 'resa-1', cle_idempotence: 'idem-1' }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('should throw BadRequestException if balance is insufficient', async () => {
    portefeuilleRepository.findOrCreateByUserId.mockResolvedValue(
      new PortefeuilleEntity({ ...mockPortefeuille, solde: 100 }),
    );

    await expect(
      useCase.execute('user-1', { reservation_id: 'resa-1', cle_idempotence: 'idem-1' }),
    ).rejects.toThrow(BadRequestException);
  });
});
