import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { VehiculeRepositoryInterface, VEHICULE_REPOSITORY } from '../../../vehicules/domain/repositories/vehicule.repository.interface';
import { UserRepositoryInterface, USER_REPOSITORY } from '../../../users/domain/repositories/user.repository.interface';
import { UserType } from '../../../users/domain/entities/user.entity';
import { TrajetStatus, TypeReservation } from '../../domain/entities/trajet.entity';
import { TrajetRepositoryInterface, TRAJET_REPOSITORY } from '../../domain/repositories/trajet.repository.interface';
import { TrajetMapper } from '../../infrastructure/mappers/trajet.mapper';
import { CreateTrajetDto } from '../dto/create-trajet.dto';
import { TrajetResponseDto } from '../dto/trajet-response.dto';

@Injectable()
export class CreateTrajetUseCase {
  constructor(
    @Inject(TRAJET_REPOSITORY)
    private readonly trajetRepository: TrajetRepositoryInterface,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryInterface,
    @Inject(VEHICULE_REPOSITORY)
    private readonly vehiculeRepository: VehiculeRepositoryInterface,
  ) {}

  async execute(conducteurId: string, dto: CreateTrajetDto): Promise<TrajetResponseDto> {
    const user = await this.userRepository.findById(conducteurId);
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable.');
    }

    const allowedRoles = [UserType.CONDUCTEUR, UserType.LES_DEUX, UserType.ADMIN];
    if (!allowedRoles.includes(user.type_utilisateur)) {
      throw new ForbiddenException('Seuls les conducteurs peuvent créer un trajet.');
    }

    const vehicules = await this.vehiculeRepository.findByProprietaireId(conducteurId);
    if (!vehicules.length) {
      throw new BadRequestException('Aucun véhicule trouvé pour ce conducteur.');
    }

    const vehicule = vehicules.find((v) => v.statut_verification === 'VERIFIE');
    if (!vehicule) {
      throw new BadRequestException('Votre véhicule doit être vérifié avant de créer un trajet.');
    }

    if (dto.places_disponibles > vehicule.nombre_places) {
      throw new BadRequestException('Le nombre de places disponibles ne peut pas dépasser celles du véhicule.');
    }

    const trajet = await this.trajetRepository.create({
      conducteur_id: conducteurId,
      vehicule_id: vehicule.id,
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
      type_reservation: dto.type_reservation ?? TypeReservation.INSTANT,
      statut: TrajetStatus.OUVERT,
      recurrence: dto.recurrence ?? null,
      preferences: dto.preferences ?? {},
      description: dto.description ?? null,
    });

    return TrajetMapper.toResponseDto(trajet);
  }
}
