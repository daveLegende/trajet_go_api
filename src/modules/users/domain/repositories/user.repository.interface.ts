import { UserEntity } from '../entities/user.entity';

export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface CreateUserData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  mot_de_passe_hash: string;
  date_naissance?: Date | null;
  photo_profil_url?: string | null;
  type_utilisateur?: UserEntity['type_utilisateur'];
  statut_verification?: UserEntity['statut_verification'];
  langue_preferee?: string;
}

export interface UserRepositoryInterface {
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findByPhone(phone: string): Promise<UserEntity | null>;
  findByEmailOrPhone(emailOrPhone: string): Promise<UserEntity | null>;
  create(data: CreateUserData): Promise<UserEntity>;
  update(id: string, data: Partial<UserEntity>): Promise<UserEntity>;
  updateLastLogin(id: string): Promise<void>;
  updateLastLogout(id: string): Promise<void>;
  updateFcmToken(id: string, fcmToken: string): Promise<void>;
}
