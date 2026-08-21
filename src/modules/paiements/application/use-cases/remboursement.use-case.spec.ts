import { BadRequestException, NotFoundException } from '@nestjs/common';
import { RemboursementUseCase } from './remboursement.use-case';
import { PortefeuilleRepositoryInterface } from '../../domain/repositories/portefeuille.repository.interface';
import { TransactionRepositoryInterface } from '../../domain/repositories/transaction.repository.interface';
import { PortefeuilleEntity } from '../../domain/entities/portefeuille.entity';
import { TransactionEntity, TransactionStatus, TransactionType } from '../../domain/entities/transaction.entity';

describe('RemboursementUseCase', () => {
  let useCase: RemboursementUseCase;
  let portefeuilleRepository: jest.Mocked<PortefeuilleRepositoryInterface>;
  let transactionRepository: jest.Mocked<TransactionRepositoryInterface>;

  const mockPortefeuille = new PortefeuilleEntity({
    id: 'wallet-1',
    user_id: 'user-1',
    solde: 0,
    date_creation: new Date(),
    date_mise_a_jour: new Date(),
  });

  const makeTx = (overrides = {}): TransactionEntity =>
    new TransactionEntity({
      id: 'tx-original',
      portefeuille_id: 'wallet-1',
      reservation_id: 'resa-1',
      type: TransactionType.PAIEMENT_RESERVATION,
      montant: 3000,
      statut: TransactionStatus.REUSSIE,
      cle_idempotence: 'idem-original',
      description: 'Paiement réservation',
      date_creation: new Date(),
      date_mise_a_jour: new Date(),
      ...overrides,
    });

  const mockRemboursementTx = new TransactionEntity({
    id: 'tx-remb',
    portefeuille_id: 'wallet-1',
    reservation_id: 'resa-1',
    type: TransactionType.REMBOURSEMENT,
    montant: 3000,
    statut: TransactionStatus.REUSSIE,
    cle_idempotence: 'idem-remb',
    description: 'Remboursement',
    date_creation: new Date(),
    date_mise_a_jour: new Date(),
  });

  beforeEach(() => {
    portefeuilleRepository = {
      findByUserId: jest.fn().mockResolvedValue(new PortefeuilleEntity({ ...mockPortefeuille })),
      findOrCreateByUserId: jest.fn(),
      updateSolde: jest.fn().mockResolvedValue(mockPortefeuille),
      save: jest.fn(),
    };

    transactionRepository = {
      create: jest.fn().mockResolvedValue(mockRemboursementTx),
      findById: jest.fn().mockResolvedValue(makeTx()),
      findByPortefeuilleId: jest.fn(),
      findByIdempotenceKey: jest.fn(),
      updateStatut: jest.fn().mockResolvedValue(makeTx({ statut: TransactionStatus.REMBOURSEE })),
    };

    useCase = new RemboursementUseCase(portefeuilleRepository, transactionRepository);
  });

  it('should refund a transaction successfully', async () => {
    const result = await useCase.execute({ transaction_id: 'tx-original', motif: 'Test motif' });

    expect(transactionRepository.updateStatut).toHaveBeenCalledWith('tx-original', TransactionStatus.REMBOURSEE);
    expect(portefeuilleRepository.updateSolde).toHaveBeenCalledWith('wallet-1', 3000); // solde 0 + 3000
    expect(transactionRepository.create).toHaveBeenCalledTimes(1);
    expect(result.type).toBe(TransactionType.REMBOURSEMENT);
  });

  it('should throw NotFoundException if transaction does not exist', async () => {
    transactionRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({ transaction_id: 'tx-missing' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException if transaction is not REUSSIE', async () => {
    transactionRepository.findById.mockResolvedValue(makeTx({ statut: TransactionStatus.EN_ATTENTE }));

    await expect(
      useCase.execute({ transaction_id: 'tx-original' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if transaction is already a refund', async () => {
    transactionRepository.findById.mockResolvedValue(makeTx({ type: TransactionType.REMBOURSEMENT }));

    await expect(
      useCase.execute({ transaction_id: 'tx-original' }),
    ).rejects.toThrow(BadRequestException);
  });
});
