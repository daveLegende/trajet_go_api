import { BadRequestException, NotFoundException } from '@nestjs/common';
import { VehiculeEntity, VehiculeVerificationStatus } from '../../domain/entities/vehicule.entity';
import { VehiculeRepositoryInterface } from '../../domain/repositories/vehicule.repository.interface';
import { VerifyVehiculeUseCase } from './verify-vehicule.use-case';

describe('VerifyVehiculeUseCase', () => {
  let useCase: VerifyVehiculeUseCase;
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
    statut_verification: VehiculeVerificationStatus.EN_ATTENTE,
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
    useCase = new VerifyVehiculeUseCase(vehiculeRepository);
  });

  it('should validate a vehicule (VERIFIE)', async () => {
    vehiculeRepository.findById.mockResolvedValue(mockVehicule);
    vehiculeRepository.update.mockResolvedValue(
      new VehiculeEntity({ ...mockVehicule, statut_verification: VehiculeVerificationStatus.VERIFIE }),
    );

    const result = await useCase.execute('vehicule-uuid-1', {
      statut: VehiculeVerificationStatus.VERIFIE,
    });
    expect(result.statut_verification).toBe(VehiculeVerificationStatus.VERIFIE);
  });

  it('should reject a vehicule (REJETE) with motif', async () => {
    vehiculeRepository.findById.mockResolvedValue(mockVehicule);
    vehiculeRepository.update.mockResolvedValue(
      new VehiculeEntity({ ...mockVehicule, statut_verification: VehiculeVerificationStatus.REJETE }),
    );

    const result = await useCase.execute('vehicule-uuid-1', {
      statut: VehiculeVerificationStatus.REJETE,
      motif: 'Documents non conformes',
    });
    expect(result.statut_verification).toBe(VehiculeVerificationStatus.REJETE);
  });

  it('should throw BadRequestException if rejecting without motif', async () => {
    vehiculeRepository.findById.mockResolvedValue(mockVehicule);

    await expect(
      useCase.execute('vehicule-uuid-1', { statut: VehiculeVerificationStatus.REJETE }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException if vehicule does not exist', async () => {
    vehiculeRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute('unknown-id', { statut: VehiculeVerificationStatus.VERIFIE }),
    ).rejects.toThrow(NotFoundException);
  });
});
