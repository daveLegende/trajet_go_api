import { BadRequestException, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { UserType } from '../../../users/domain/entities/user.entity';
import { UserRepositoryInterface, USER_REPOSITORY } from '../../../users/domain/repositories/user.repository.interface';
import { VehiculeEntity } from '../../domain/entities/vehicule.entity';
import {
  VEHICULE_REPOSITORY,
  VehiculeRepositoryInterface,
} from '../../domain/repositories/vehicule.repository.interface';
import { CreateVehiculeDto } from '../dto/create-vehicule.dto';
import { VehiculeMapper } from '../../infrastructure/mappers/vehicule.mapper';
import { VehiculeResponseDto } from '../dto/vehicule-response.dto';

@Injectable()
export class CreateVehiculeUseCase {
  constructor(
    @Inject(VEHICULE_REPOSITORY)
    private readonly vehiculeRepository: VehiculeRepositoryInterface,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async execute(proprietaireId: string, dto: CreateVehiculeDto): Promise<VehiculeResponseDto> {
    // Vérifier que l'utilisateur est un conducteur ou admin
    const user = await this.userRepository.findById(proprietaireId);
    if (!user) {
      throw new BadRequestException('Utilisateur introuvable');
    }

    const allowedRoles: string[] = [UserType.CONDUCTEUR, UserType.LES_DEUX, UserType.ADMIN];
    if (!allowedRoles.includes(user.type_utilisateur)) {
      throw new ForbiddenException(
        'Seuls les conducteurs peuvent enregistrer un véhicule. Mettez à jour votre profil pour devenir conducteur.',
      );
    }

    // Vérifier que l'immatriculation est unique
    const existing = await this.vehiculeRepository.findByImmatriculation(dto.immatriculation);
    if (existing) {
      throw new BadRequestException(
        `Un véhicule avec l'immatriculation "${dto.immatriculation}" existe déjà.`,
      );
    }

    const vehicule = await this.vehiculeRepository.create({
      proprietaire_id: proprietaireId,
      marque: dto.marque,
      modele: dto.modele,
      couleur: dto.couleur,
      immatriculation: dto.immatriculation,
      nombre_places: dto.nombre_places,
      annee: dto.annee,
      carte_grise_url: dto.carte_grise_url ?? null,
      assurance_url: dto.assurance_url ?? null,
      date_expiration_assurance: dto.date_expiration_assurance
        ? new Date(dto.date_expiration_assurance)
        : null,
      photos: dto.photos ?? [],
    });

    return VehiculeMapper.toResponseDto(vehicule);
  }
}
