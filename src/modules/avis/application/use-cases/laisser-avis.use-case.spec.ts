import { BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { LaisserAvisUseCase } from './laisser-avis.use-case';
import { AvisRepositoryInterface } from '../../domain/repositories/avis.repository.interface';
import { UserRepositoryInterface } from '../../../users/domain/repositories/user.repository.interface';
import { TrajetRepositoryInterface } from '../../../trajets/domain/repositories/trajet.repository.interface';
import { ReservationRepositoryInterface } from '../../../reservations/domain/repositories/reservation.repository.interface';
import { AvisEntity } from '../../domain/entities/avis.entity';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { TrajetEntity, TypeReservation, TrajetStatus } from '../../../trajets/domain/entities/trajet.entity';
import { ReservationEntity, StatutReservation } from '../../../reservations/domain/entities/reservation.entity';

describe('LaisserAvisUseCase', () => {
  let useCase: LaisserAvisUseCase;
  let avisRepository: jest.Mocked<AvisRepositoryInterface>;
  let userRepository: jest.Mocked<UserRepositoryInterface>;
  let trajetRepository: jest.Mocked<TrajetRepositoryInterface>;
  let reservationRepository: jest.Mocked<ReservationRepositoryInterface>;

  const mockCible = new UserEntity({ id: 'cible-1' });
  
  const mockTrajet = new TrajetEntity({
    id: 'trajet-1',
    conducteur_id: 'cible-1', // Cible est conducteur par défaut
  });

  const mockReservation = new ReservationEntity({
    id: 'resa-1',
    trajet_id: 'trajet-1',
    passager_id: 'auteur-1', // Auteur est passager par défaut
    statut: StatutReservation.ACCEPTEE,
  });

  const mockAvis = new AvisEntity({
    id: 'avis-1',
    auteur_id: 'auteur-1',
    cible_id: 'cible-1',
    trajet_id: 'trajet-1',
    note: 5,
    commentaire: 'Super conducteur',
    date_creation: new Date(),
  });

  beforeEach(() => {
    avisRepository = {
      create: jest.fn().mockResolvedValue(mockAvis),
      findByAuteurAndCibleAndTrajet: jest.fn().mockResolvedValue(null),
      findByCibleId: jest.fn(),
      getMoyenneAndCountForUser: jest.fn().mockResolvedValue({ moyenne: 5, count: 1 }),
    };

    userRepository = {
      findById: jest.fn().mockResolvedValue(mockCible),
      update: jest.fn().mockResolvedValue(mockCible),
      findByEmail: jest.fn(),
      findByPhone: jest.fn(),
      findByEmailOrPhone: jest.fn(),
      create: jest.fn(),
      updateLastLogin: jest.fn(),
      updateLastLogout: jest.fn(),
      updateFcmToken: jest.fn(),
    };

    trajetRepository = {
      findById: jest.fn().mockResolvedValue(mockTrajet),
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
    };

    reservationRepository = {
      findByPassagerId: jest.fn().mockResolvedValue([mockReservation]),
      findById: jest.fn(),
      findByTrajetId: jest.fn(),
      create: jest.fn(),
      updateStatut: jest.fn(),
    };

    useCase = new LaisserAvisUseCase(
      avisRepository,
      userRepository,
      trajetRepository,
      reservationRepository,
    );
  });

  it('devrait créer un avis et mettre à jour la note moyenne de la cible', async () => {
    const result = await useCase.execute('auteur-1', {
      cible_id: 'cible-1',
      trajet_id: 'trajet-1',
      note: 5,
      commentaire: 'Super conducteur',
    });

    expect(avisRepository.create).toHaveBeenCalled();
    expect(userRepository.update).toHaveBeenCalledWith('cible-1', { note_moyenne: 5 });
    expect(result.note).toBe(5);
  });

  it('devrait échouer si la cible n\'existe pas', async () => {
    userRepository.findById.mockResolvedValue(null);
    await expect(
      useCase.execute('auteur-1', { cible_id: 'cible-fake', trajet_id: 'trajet-1', note: 5 }),
    ).rejects.toThrow(NotFoundException);
  });

  it('devrait échouer si on se note soi-même', async () => {
    await expect(
      useCase.execute('cible-1', { cible_id: 'cible-1', trajet_id: 'trajet-1', note: 5 }),
    ).rejects.toThrow(BadRequestException);
  });

  it('devrait échouer si on a déjà noté cette personne pour ce trajet', async () => {
    avisRepository.findByAuteurAndCibleAndTrajet.mockResolvedValue(mockAvis);
    await expect(
      useCase.execute('auteur-1', { cible_id: 'cible-1', trajet_id: 'trajet-1', note: 5 }),
    ).rejects.toThrow(BadRequestException);
  });

  it('devrait échouer si on n\'a pas participé au trajet (pas de résa)', async () => {
    reservationRepository.findByPassagerId.mockResolvedValue([]);
    await expect(
      useCase.execute('auteur-inconnu', { cible_id: 'cible-1', trajet_id: 'trajet-1', note: 5 }),
    ).rejects.toThrow(ForbiddenException);
  });
});
