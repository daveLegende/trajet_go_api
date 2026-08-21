import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UserType } from '../../../users/domain/entities/user.entity';
import { VehiculeEntity, VehiculeVerificationStatus } from '../../domain/entities/vehicule.entity';
import { VehiculeRepositoryInterface } from '../../domain/repositories/vehicule.repository.interface';
import { GetVehiculeByIdUseCase } from './get-vehicule-by-id.use-case';

describe('GetVehiculeByIdUseCase', () => {
  let useCase: GetVehiculeByIdUseCase;
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
    useCase = new GetVehiculeByIdUseCase(vehiculeRepository);
  });

  it('should return vehicule if requester is the owner', async () => {
    vehiculeRepository.findById.mockResolvedValue(mockVehicule);
    const result = await useCase.execute('vehicule-uuid-1', 'owner-uuid-1', UserType.CONDUCTEUR);
    expect(result.id).toBe('vehicule-uuid-1');
  });

  it('should return vehicule if requester is ADMIN', async () => {
    vehiculeRepository.findById.mockResolvedValue(mockVehicule);
    const result = await useCase.execute('vehicule-uuid-1', 'admin-uuid', UserType.ADMIN);
    expect(result.id).toBe('vehicule-uuid-1');
  });

  it('should throw ForbiddenException if requester is not owner nor admin', async () => {
    vehiculeRepository.findById.mockResolvedValue(mockVehicule);
    await expect(
      useCase.execute('vehicule-uuid-1', 'other-user-uuid', UserType.PASSAGER),
    ).rejects.toThrow(ForbiddenException);
  });

  it('should throw NotFoundException if vehicule does not exist', async () => {
    vehiculeRepository.findById.mockResolvedValue(null);
    await expect(
      useCase.execute('unknown-id', 'owner-uuid-1', UserType.CONDUCTEUR),
    ).rejects.toThrow(NotFoundException);
  });
});
