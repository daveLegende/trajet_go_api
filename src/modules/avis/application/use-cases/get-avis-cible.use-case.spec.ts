import { GetAvisCibleUseCase } from './get-avis-cible.use-case';
import { AvisRepositoryInterface } from '../../domain/repositories/avis.repository.interface';
import { AvisEntity } from '../../domain/entities/avis.entity';

describe('GetAvisCibleUseCase', () => {
  let useCase: GetAvisCibleUseCase;
  let avisRepository: jest.Mocked<AvisRepositoryInterface>;

  const mockAvis = new AvisEntity({
    id: 'avis-1',
    auteur_id: 'auteur-1',
    cible_id: 'cible-1',
    trajet_id: 'trajet-1',
    note: 5,
    commentaire: 'Super',
    date_creation: new Date(),
  });

  beforeEach(() => {
    avisRepository = {
      create: jest.fn(),
      findByAuteurAndCibleAndTrajet: jest.fn(),
      findByCibleId: jest.fn().mockResolvedValue({
        data: [mockAvis],
        total: 1,
      }),
      getMoyenneAndCountForUser: jest.fn(),
    };

    useCase = new GetAvisCibleUseCase(avisRepository);
  });

  it('devrait retourner les avis paginés', async () => {
    const result = await useCase.execute('cible-1', 1, 10);

    expect(avisRepository.findByCibleId).toHaveBeenCalledWith('cible-1', 1, 10);
    expect(result.data).toHaveLength(1);
    expect(result.total).toBe(1);
    expect(result.data[0].id).toBe('avis-1');
  });
});
