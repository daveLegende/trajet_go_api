import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { AVIS_REPOSITORY, AvisRepositoryInterface } from '../../domain/repositories/avis.repository.interface';
import { CreateAvisDto } from '../dto/create-avis.dto';
import { AvisResponseDto } from '../dto/avis-response.dto';
import { USER_REPOSITORY, UserRepositoryInterface } from '../../../users/domain/repositories/user.repository.interface';
import { TRAJET_REPOSITORY, TrajetRepositoryInterface } from '../../../trajets/domain/repositories/trajet.repository.interface';
import { RESERVATION_REPOSITORY, ReservationRepositoryInterface } from '../../../reservations/domain/repositories/reservation.repository.interface';
import { StatutReservation } from '../../../reservations/domain/entities/reservation.entity';

@Injectable()
export class LaisserAvisUseCase {
  constructor(
    @Inject(AVIS_REPOSITORY)
    private readonly avisRepository: AvisRepositoryInterface,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryInterface,
    @Inject(TRAJET_REPOSITORY)
    private readonly trajetRepository: TrajetRepositoryInterface,
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepository: ReservationRepositoryInterface,
  ) {}

  async execute(auteur_id: string, dto: CreateAvisDto): Promise<AvisResponseDto> {
    if (auteur_id === dto.cible_id) {
      throw new BadRequestException('Vous ne pouvez pas vous noter vous-même');
    }

    // 1. Vérifier que la cible existe
    const cible = await this.userRepository.findById(dto.cible_id);
    if (!cible) {
      throw new NotFoundException('Utilisateur cible introuvable');
    }

    // 2. Vérifier que le trajet existe
    const trajet = await this.trajetRepository.findById(dto.trajet_id);
    if (!trajet) {
      throw new NotFoundException('Trajet introuvable');
    }

    // 3. Vérifier que l'auteur n'a pas déjà noté cette cible pour ce trajet
    const existingAvis = await this.avisRepository.findByAuteurAndCibleAndTrajet(
      auteur_id,
      dto.cible_id,
      dto.trajet_id,
    );
    if (existingAvis) {
      throw new BadRequestException('Vous avez déjà laissé un avis pour cette personne sur ce trajet');
    }

    // 4. Vérifier la participation au trajet (soit conducteur, soit passager avec résa acceptée/terminée)
    const isAuteurConducteur = trajet.conducteur_id === auteur_id;
    const isCibleConducteur = trajet.conducteur_id === dto.cible_id;

    if (!isAuteurConducteur && !isCibleConducteur) {
      // Aucun n'est conducteur, ils doivent tous les deux être passagers avec des résas acceptées
      const [resAuteur, resCible] = await Promise.all([
        this.getValidReservation(auteur_id, trajet.id),
        this.getValidReservation(dto.cible_id, trajet.id),
      ]);
      if (!resAuteur || !resCible) {
        throw new ForbiddenException('Vous devez avoir voyagé ensemble sur ce trajet pour laisser un avis');
      }
    } else if (isAuteurConducteur) {
      // L'auteur est le conducteur, la cible doit être un passager valide
      const resCible = await this.getValidReservation(dto.cible_id, trajet.id);
      if (!resCible) {
        throw new ForbiddenException('L\'utilisateur cible n\'a pas voyagé sur ce trajet');
      }
    } else {
      // La cible est le conducteur, l'auteur doit être un passager valide
      const resAuteur = await this.getValidReservation(auteur_id, trajet.id);
      if (!resAuteur) {
        throw new ForbiddenException('Vous n\'avez pas voyagé sur ce trajet');
      }
    }

    // 5. Créer l'avis
    const avis = await this.avisRepository.create({
      auteur_id,
      cible_id: dto.cible_id,
      trajet_id: dto.trajet_id,
      note: dto.note,
      commentaire: dto.commentaire,
    });

    // 6. Recalculer et mettre à jour la note moyenne de la cible
    const { moyenne } = await this.avisRepository.getMoyenneAndCountForUser(dto.cible_id);
    await this.userRepository.update(dto.cible_id, {
      note_moyenne: moyenne as any, // On caste car le type Decimal peut être complexe selon l'implémentation
    });

    return AvisResponseDto.fromEntity(avis);
  }

  private async getValidReservation(passager_id: string, trajet_id: string) {
    const reservations = await this.reservationRepository.findByPassagerId(passager_id);
    return reservations.find(
      (r) => r.trajet_id === trajet_id && 
      (r.statut === StatutReservation.ACCEPTEE || r.statut === 'TERMINEE' as any)
    );
  }
}
