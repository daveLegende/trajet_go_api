import { GetHistoriqueTransactionsUseCase } from './get-historique-transactions.use-case';
import { PortefeuilleRepositoryInterface } from '../../domain/repositories/portefeuille.repository.interface';
import { TransactionRepositoryInterface } from '../../domain/repositories/transaction.repository.interface';
import { PortefeuilleEntity } from '../../domain/entities/portefeuille.entity';
import { TransactionEntity, TransactionStatus, TransactionType } from '../../domain/entities/transaction.entity';

describe('GetHistoriqueTransactionsUseCase', () => {
  let useCase: GetHistoriqueTransactionsUseCase;
  let portefeuilleRepository: jest.Mocked<PortefeuilleRepositoryInterface>;
  let transactionRepository: jest.Mocked<TransactionRepositoryInterface>;

  const mockPortefeuille = new PortefeuilleEntity({
    id: 'wallet-1',
    user_id: 'user-1',
    solde: 5000,
    date_creation: new Date(),
    date_mise_a_jour: new Date(),
  });

  const makeTx = (id: string): TransactionEntity =>
    new TransactionEntity({
      id,
      portefeuille_id: 'wallet-1',
      reservation_id: null,
      type: TransactionType.CREDIT,
      montant: 1000,
      statut: TransactionStatus.REUSSIE,
      cle_idempotence: `key-${id}`,
      description: null,
      date_creation: new Date(),
      date_mise_a_jour: new Date(),
    });

  beforeEach(() => {
    portefeuilleRepository = {
      findByUserId: jest.fn(),
      findOrCreateByUserId: jest.fn().mockResolvedValue(mockPortefeuille),
      updateSolde: jest.fn(),
      save: jest.fn(),
    };

    transactionRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByPortefeuilleId: jest.fn().mockResolvedValue({
        data: [makeTx('tx-1'), makeTx('tx-2')],
        total: 2,
      }),
      findByIdempotenceKey: jest.fn(),
      updateStatut: jest.fn(),
    };

    useCase = new GetHistoriqueTransactionsUseCase(portefeuilleRepository, transactionRepository);
  });

  it('should return paginated transaction history', async () => {
    const result = await useCase.execute('user-1', 1, 20);

    expect(result.data).toHaveLength(2);
    expect(result.total).toBe(2);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(20);
    expect(transactionRepository.findByPortefeuilleId).toHaveBeenCalledWith('wallet-1', 1, 20);
  });

  it('should use default pagination when not specified', async () => {
    await useCase.execute('user-1');

    expect(transactionRepository.findByPortefeuilleId).toHaveBeenCalledWith('wallet-1', 1, 20);
  });
});
