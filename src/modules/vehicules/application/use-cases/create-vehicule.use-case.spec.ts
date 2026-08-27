import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { UserType, VerificationStatus, AccountStatus, UserEntity } from '../../../users/domain/entities/user.entity';
import { UserRepositoryInterface } from '../../../users/domain/repositories/user.repository.interface';
import { VehiculeEntity, VehiculeVerificationStatus } from '../../domain/entities/vehicule.entity';
import { VehiculeRepositoryInterface } from '../../domain/repositories/vehicule.repository.interface';
import { CreateVehiculeUseCase } from './create-vehicule.use-case';
import { CreateVehiculeDto } from '../dto/create-vehicule.dto';

describe('CreateVehiculeUseCase', () => {
  let useCase: CreateVehiculeUseCase;
  let vehiculeRepository: jest.Mocked<VehiculeRepositoryInterface>;
  let userRepository: jest.Mocked<UserRepositoryInterface>;

  const conducteurUser = new UserEntity({
    id: 'user-conducteur-1',
    nom: 'Koffi',
    prenom: 'Abalo',
    email: 'koffi@example.com',
    telephone: '+22890123456',
    mot_de_passe_hash: 'hash',
    date_naissance: null,
    photo_profil_url: null,
    type_utilisateur: UserType.CONDUCTEUR,
    statut_verification: VerificationStatus.NON_VERIFIE,
    piece_identite_url: null,
    note_moyenne: 0,
    nombre_trajets: 0,
    langue_preferee: 'fr',
    statut_compte: AccountStatus.ACTIF,
    date_creation: new Date(),
    date_derniere_connexion: null,
  });

  const passagerUser = new UserEntity({
    ...conducteurUser,
    id: 'user-passager-1',
    type_utilisateur: UserType.PASSAGER,
  });

  const dto: CreateVehiculeDto = {
    marque: 'Toyota',
    modele: 'Corolla',
    couleur: 'Blanc',
    immatriculation: 'TG-1234-AZ',
    nombre_places: 4,
    annee: 2019,
  };

  const mockVehicule = new VehiculeEntity({
    id: 'vehicule-uuid-1',
    proprietaire_id: 'user-conducteur-1',
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

    userRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findByPhone: jest.fn(),
      findByEmailOrPhone: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateLastLogin: jest.fn(),
      updateLastLogout: jest.fn(),
      updateFcmToken: jest.fn(),
    };

    useCase = new CreateVehiculeUseCase(vehiculeRepository, userRepository);
  });

  it('should create a vehicule successfully for a conducteur', async () => {
    userRepository.findById.mockResolvedValue(conducteurUser);
    vehiculeRepository.findByImmatriculation.mockResolvedValue(null);
    vehiculeRepository.create.mockResolvedValue(mockVehicule);

    const result = await useCase.execute('user-conducteur-1', dto);

    expect(result.immatriculation).toBe('TG-1234-AZ');
    expect(result.statut_verification).toBe(VehiculeVerificationStatus.EN_ATTENTE);
    expect(vehiculeRepository.create).toHaveBeenCalledTimes(1);
  });

  it('should throw ForbiddenException if user is not a conducteur', async () => {
    userRepository.findById.mockResolvedValue(passagerUser);

    await expect(useCase.execute('user-passager-1', dto)).rejects.toThrow(ForbiddenException);
  });

  it('should throw BadRequestException if immatriculation already exists', async () => {
    userRepository.findById.mockResolvedValue(conducteurUser);
    vehiculeRepository.findByImmatriculation.mockResolvedValue(mockVehicule);

    await expect(useCase.execute('user-conducteur-1', dto)).rejects.toThrow(BadRequestException);
  });
});
