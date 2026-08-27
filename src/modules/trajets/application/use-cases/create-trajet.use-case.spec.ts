import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { UserType, AccountStatus, VerificationStatus, UserEntity } from '../../../users/domain/entities/user.entity';
import { UserRepositoryInterface } from '../../../users/domain/repositories/user.repository.interface';
import { VehiculeEntity, VehiculeVerificationStatus } from '../../../vehicules/domain/entities/vehicule.entity';
import { VehiculeRepositoryInterface } from '../../../vehicules/domain/repositories/vehicule.repository.interface';
import { TrajetEntity, TrajetStatus, TypeReservation } from '../../domain/entities/trajet.entity';
import { TrajetRepositoryInterface } from '../../domain/repositories/trajet.repository.interface';
import { CreateTrajetUseCase } from './create-trajet.use-case';
import { CreateTrajetDto } from '../dto/create-trajet.dto';

describe('CreateTrajetUseCase', () => {
  let useCase: CreateTrajetUseCase;
  let trajetRepository: jest.Mocked<TrajetRepositoryInterface>;
  let userRepository: jest.Mocked<UserRepositoryInterface>;
  let vehiculeRepository: jest.Mocked<VehiculeRepositoryInterface>;

  const conducteurUser = new UserEntity({
    id: 'user-conducteur-1',
    nom: 'Mensah',
    prenom: 'Kodjo',
    email: 'kodjo@example.com',
    telephone: '+22890000000',
    mot_de_passe_hash: 'hash',
    type_utilisateur: UserType.CONDUCTEUR,
    statut_verification: VerificationStatus.VERIFIE,
    statut_compte: AccountStatus.ACTIF,
    date_naissance: null,
    photo_profil_url: null,
    piece_identite_url: null,
    note_moyenne: 0,
    nombre_trajets: 0,
    langue_preferee: 'fr',
    date_creation: new Date(),
    date_derniere_connexion: null,
    date_derniere_deconnexion: null,
  });

  const passagerUser = new UserEntity({
    ...conducteurUser,
    id: 'user-passager-1',
    type_utilisateur: UserType.PASSAGER,
  });

  const vehicule = new VehiculeEntity({
    id: 'vehicule-1',
    proprietaire_id: 'user-conducteur-1',
    marque: 'Toyota',
    modele: 'Corolla',
    couleur: 'Blanc',
    immatriculation: 'TG-1234-AZ',
    nombre_places: 4,
    annee: 2021,
    carte_grise_url: null,
    assurance_url: null,
    date_expiration_assurance: null,
    statut_verification: VehiculeVerificationStatus.VERIFIE,
    photos: [],
    date_creation: new Date(),
    date_mise_a_jour: new Date(),
  });

  const dto: CreateTrajetDto = {
    ville_depart: 'Lomé',
    ville_arrivee: 'Kpalimé',
    latitude_depart: 6.125,
    longitude_depart: 1.2136,
    latitude_arrivee: 6.136,
    longitude_arrivee: 1.222,
    date_depart: '2026-08-20T08:00:00.000Z',
    heure_depart: '08:30',
    places_disponibles: 3,
    prix_par_place: 2500,
    type_reservation: TypeReservation.INSTANT,
    description: 'Trajet régulier',
    preferences: { fumeur: false },
  };

  beforeEach(() => {
    trajetRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
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

    vehiculeRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByImmatriculation: jest.fn(),
      findByProprietaireId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new CreateTrajetUseCase(
      trajetRepository,
      userRepository,
      vehiculeRepository,
    );
  });

  it('should create a trajet for a verified conductor', async () => {
    userRepository.findById.mockResolvedValue(conducteurUser);
    vehiculeRepository.findByProprietaireId.mockResolvedValue([vehicule]);
    trajetRepository.create.mockResolvedValue(
      new TrajetEntity({
        id: 'trajet-1',
        conducteur_id: 'user-conducteur-1',
        vehicule_id: 'vehicule-1',
        ville_depart: dto.ville_depart,
        ville_arrivee: dto.ville_arrivee,
        latitude_depart: dto.latitude_depart,
        longitude_depart: dto.longitude_depart,
        latitude_arrivee: dto.latitude_arrivee,
        longitude_arrivee: dto.longitude_arrivee,
        date_depart: new Date(dto.date_depart),
        heure_depart: dto.heure_depart,
        places_disponibles: dto.places_disponibles,
        prix_par_place: dto.prix_par_place,
        type_reservation: dto.type_reservation,
        statut: TrajetStatus.OUVERT,
        recurrence: null,
        preferences: dto.preferences,
        description: dto.description,
        date_creation: new Date(),
        date_mise_a_jour: new Date(),
      }),
    );

    const result = await useCase.execute('user-conducteur-1', dto);

    expect(result.ville_depart).toBe('Lomé');
    expect(result.statut).toBe(TrajetStatus.OUVERT);
    expect(trajetRepository.create).toHaveBeenCalledTimes(1);
  });

  it('should throw ForbiddenException if user is not a conductor', async () => {
    userRepository.findById.mockResolvedValue(passagerUser);

    await expect(useCase.execute('user-passager-1', dto)).rejects.toThrow(ForbiddenException);
  });

  it('should throw BadRequestException if conductor has no verified vehicle', async () => {
    userRepository.findById.mockResolvedValue(conducteurUser);
    vehiculeRepository.findByProprietaireId.mockResolvedValue([
      new VehiculeEntity({
        ...vehicule,
        statut_verification: VehiculeVerificationStatus.EN_ATTENTE,
      }),
    ]);

    await expect(useCase.execute('user-conducteur-1', dto)).rejects.toThrow(BadRequestException);
  });
});
