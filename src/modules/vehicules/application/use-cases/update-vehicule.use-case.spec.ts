import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { VehiculeEntity, VehiculeVerificationStatus } from '../../domain/entities/vehicule.entity';
import { VehiculeRepositoryInterface } from '../../domain/repositories/vehicule.repository.interface';
import { UpdateVehiculeUseCase } from './update-vehicule.use-case';

describe('UpdateVehiculeUseCase', () => {
  let useCase: UpdateVehiculeUseCase;
  let vehiculeRepository: jest.Mocked<VehiculeRepositoryInterface>;

  const mockVehicule = new VehiculeEntity({
    id: 'vehicule-uuid-1',
    proprietaire_id: 'owner-uuid-1',
    marque: 'Toyota',
    modele: 'Corolla',
    couleur: 'Blanc',
    immatriculation: 'TG-1234-AZ',
    nombre_places: 4,
    annee: 2019,
    carte_grise_url: null,
    assurance_url: null,
    date_expiration_assurance: null,
    statut_verification: VehiculeVerificationStatus.VERIFIE,
    photos: [],
    date_creation: new Date(),
    date_mise_a_jour: new Date(),
  });

  beforeEach(() => {
    vehiculeRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByImmatriculation: jest.fn(),
      findByProprietaireId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new UpdateVehiculeUseCase(vehiculeRepository);
  });

  it('should update vehicule successfully for the owner', async () => {
    vehiculeRepository.findById.mockResolvedValue(mockVehicule);
    vehiculeRepository.update.mockResolvedValue(
      new VehiculeEntity({ ...mockVehicule, couleur: 'Rouge' }),
    );

    const result = await useCase.execute('vehicule-uuid-1', 'owner-uuid-1', { couleur: 'Rouge' });
    expect(result.couleur).toBe('Rouge');
  });

  it('should reset statut_verification to EN_ATTENTE when documents change', async () => {
    vehiculeRepository.findById.mockResolvedValue(mockVehicule);
    vehiculeRepository.update.mockResolvedValue(
      new VehiculeEntity({
        ...mockVehicule,
        statut_verification: VehiculeVerificationStatus.EN_ATTENTE,
        assurance_url: 'https://cdn.trajetgo.tg/assurance.jpg',
      }),
    );

    const result = await useCase.execute('vehicule-uuid-1', 'owner-uuid-1', {
      assurance_url: 'https://cdn.trajetgo.tg/assurance.jpg',
    });
    expect(result.statut_verification).toBe(VehiculeVerificationStatus.EN_ATTENTE);
  });

  it('should throw ForbiddenException if requester is not the owner', async () => {
    vehiculeRepository.findById.mockResolvedValue(mockVehicule);
    await expect(
      useCase.execute('vehicule-uuid-1', 'other-user', { couleur: 'Bleu' }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('should throw NotFoundException if vehicule does not exist', async () => {
    vehiculeRepository.findById.mockResolvedValue(null);
    await expect(
      useCase.execute('unknown-id', 'owner-uuid-1', { couleur: 'Bleu' }),
    ).rejects.toThrow(NotFoundException);
  });
});
