import { BadRequestException } from '@nestjs/common';
import { CreditPortefeuilleUseCase } from './credit-portefeuille.use-case';
import { PortefeuilleRepositoryInterface } from '../../domain/repositories/portefeuille.repository.interface';
import { TransactionRepositoryInterface } from '../../domain/repositories/transaction.repository.interface';
import { PaymentProviderPort } from '../../domain/ports/paiement-provider.port';
import { PortefeuilleEntity } from '../../domain/entities/portefeuille.entity';
import { TransactionEntity, TransactionStatus, TransactionType } from '../../domain/entities/transaction.entity';

describe('CreditPortefeuilleUseCase', () => {
  let useCase: CreditPortefeuilleUseCase;
  let portefeuilleRepository: jest.Mocked<PortefeuilleRepositoryInterface>;
  let transactionRepository: jest.Mocked<TransactionRepositoryInterface>;
  let paymentProvider: jest.Mocked<PaymentProviderPort>;

  const mockPortefeuille = new PortefeuilleEntity({
    id: 'wallet-1',
    user_id: 'user-1',
    solde: 0,
    date_creation: new Date(),
    date_mise_a_jour: new Date(),
  });

  const makeMockTransaction = (overrides = {}): TransactionEntity =>
    new TransactionEntity({
      id: 'tx-1',
      portefeuille_id: 'wallet-1',
      reservation_id: null,
      type: TransactionType.CREDIT,
      montant: 5000,
      statut: TransactionStatus.EN_ATTENTE,
      cle_idempotence: 'idem-key-1',
      description: 'Recharge',
      date_creation: new Date(),
      date_mise_a_jour: new Date(),
      ...overrides,
    });

  beforeEach(() => {
    portefeuilleRepository = {
      findByUserId: jest.fn(),
      findOrCreateByUserId: jest.fn().mockResolvedValue(mockPortefeuille),
      updateSolde: jest.fn().mockResolvedValue(mockPortefeuille),
      save: jest.fn(),
    };

    transactionRepository = {
      create: jest.fn().mockResolvedValue(makeMockTransaction()),
      findById: jest.fn(),
      findByPortefeuilleId: jest.fn(),
      findByIdempotenceKey: jest.fn().mockResolvedValue(null),
      updateStatut: jest.fn().mockImplementation((id, statut) =>
        Promise.resolve(makeMockTransaction({ statut })),
      ),
    };

    paymentProvider = {
      initiatePayment: jest.fn().mockResolvedValue({ success: true, reference: 'REF-123' }),
    };

    useCase = new CreditPortefeuilleUseCase(
      portefeuilleRepository,
      transactionRepository,
      paymentProvider,
    );
  });

  it('should credit the wallet successfully', async () => {
    const result = await useCase.execute('user-1', {
      montant: 5000,
      cle_idempotence: 'idem-key-1',
    });

    expect(paymentProvider.initiatePayment).toHaveBeenCalledTimes(1);
    expect(portefeuilleRepository.updateSolde).toHaveBeenCalledWith('wallet-1', 5000);
    expect(transactionRepository.updateStatut).toHaveBeenCalledWith('tx-1', TransactionStatus.REUSSIE);
    expect(result.statut).toBe(TransactionStatus.REUSSIE);
  });

  it('should return existing transaction for same idempotence key (no double credit)', async () => {
    const existingTx = makeMockTransaction({ statut: TransactionStatus.REUSSIE });
    transactionRepository.findByIdempotenceKey.mockResolvedValue(existingTx);

    const result = await useCase.execute('user-1', {
      montant: 5000,
      cle_idempotence: 'idem-key-1',
    });

    expect(paymentProvider.initiatePayment).not.toHaveBeenCalled();
    expect(portefeuilleRepository.updateSolde).not.toHaveBeenCalled();
    expect(result.id).toBe('tx-1');
  });

  it('should throw BadRequestException and mark transaction ECHEC if payment fails', async () => {
    paymentProvider.initiatePayment.mockResolvedValue({
      success: false,
      message: 'Solde Mobile Money insuffisant',
    });

    await expect(
      useCase.execute('user-1', { montant: 5000, cle_idempotence: 'idem-key-2' }),
    ).rejects.toThrow(BadRequestException);

    expect(transactionRepository.updateStatut).toHaveBeenCalledWith('tx-1', TransactionStatus.ECHEC);
    expect(portefeuilleRepository.updateSolde).not.toHaveBeenCalled();
  });
});
