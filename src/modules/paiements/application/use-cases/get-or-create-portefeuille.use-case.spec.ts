import { GetOrCreatePortefeuilleUseCase } from './get-or-create-portefeuille.use-case';
import { PortefeuilleRepositoryInterface } from '../../domain/repositories/portefeuille.repository.interface';
import { PortefeuilleEntity } from '../../domain/entities/portefeuille.entity';

describe('GetOrCreatePortefeuilleUseCase', () => {
  let useCase: GetOrCreatePortefeuilleUseCase;
  let portefeuilleRepository: jest.Mocked<PortefeuilleRepositoryInterface>;

  const mockPortefeuille: PortefeuilleEntity = new PortefeuilleEntity({
    id: 'wallet-1',
    user_id: 'user-1',
    solde: 0,
    date_creation: new Date('2026-01-01'),
    date_mise_a_jour: new Date('2026-01-01'),
  });

  beforeEach(() => {
    portefeuilleRepository = {
      findByUserId: jest.fn(),
      findOrCreateByUserId: jest.fn(),
      updateSolde: jest.fn(),
      save: jest.fn(),
    };

    useCase = new GetOrCreatePortefeuilleUseCase(portefeuilleRepository);
  });

  it('should return an existing wallet', async () => {
    portefeuilleRepository.findOrCreateByUserId.mockResolvedValue(mockPortefeuille);

    const result = await useCase.execute('user-1');

    expect(portefeuilleRepository.findOrCreateByUserId).toHaveBeenCalledWith('user-1');
    expect(result.id).toBe('wallet-1');
    expect(result.solde).toBe(0);
  });

  it('should create and return a new wallet if none exists', async () => {
    const newWallet = new PortefeuilleEntity({
      id: 'wallet-new',
      user_id: 'user-2',
      solde: 0,
      date_creation: new Date(),
      date_mise_a_jour: new Date(),
    });
    portefeuilleRepository.findOrCreateByUserId.mockResolvedValue(newWallet);

    const result = await useCase.execute('user-2');

    expect(result.user_id).toBe('user-2');
    expect(result.solde).toBe(0);
  });
});
