import { NotFoundException } from '@nestjs/common';
import {
  AccountStatus,
  UserEntity,
  UserType,
  VerificationStatus,
} from '../../../users/domain/entities/user.entity';
import { UserRepositoryInterface } from '../../../users/domain/repositories/user.repository.interface';
import { GetUserProfileUseCase } from './get-user-profile.use-case';

describe('GetUserProfileUseCase', () => {
  let useCase: GetUserProfileUseCase;
  let userRepository: jest.Mocked<UserRepositoryInterface>;

  const mockUser = new UserEntity({
    id: 'user-uuid-1',
    nom: 'Koffi',
    prenom: 'Abalo',
    email: 'koffi@example.com',
    telephone: '+22890123456',
    mot_de_passe_hash: 'hashed-password',
    date_naissance: null,
    photo_profil_url: null,
    type_utilisateur: UserType.PASSAGER,
    statut_verification: VerificationStatus.NON_VERIFIE,
    piece_identite_url: null,
    note_moyenne: 5.0,
    nombre_trajets: 2,
    langue_preferee: 'fr',
    statut_compte: AccountStatus.ACTIF,
    date_creation: new Date('2026-08-18T10:00:00.000Z'),
    date_derniere_connexion: null,
  });

  beforeEach(() => {
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

    useCase = new GetUserProfileUseCase(userRepository);
  });

  it('should return user profile without sensitive fields', async () => {
    userRepository.findById.mockResolvedValue(mockUser);

    const result = await useCase.execute('user-uuid-1');

    expect(result.id).toBe('user-uuid-1');
    expect(result.email).toBe('koffi@example.com');
    expect(result.telephone).toBe('+22890123456');
    expect((result as any).mot_de_passe_hash).toBeUndefined();
  });

  it('should throw NotFoundException if user does not exist', async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('unknown-id')).rejects.toThrow(
      NotFoundException,
    );
  });
});
