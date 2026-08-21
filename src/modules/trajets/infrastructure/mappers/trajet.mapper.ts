import { TrajetEntity, TrajetStatus, TypeReservation } from '../../domain/entities/trajet.entity';
import { TrajetResponseDto } from '../../application/dto/trajet-response.dto';

export class TrajetMapper {
  static toDomain(raw: any): TrajetEntity {
    return new TrajetEntity({
      id: raw.id,
      conducteur_id: raw.conducteur_id,
      vehicule_id: raw.vehicule_id,
      ville_depart: raw.ville_depart,
      ville_arrivee: raw.ville_arrivee,
      latitude_depart: raw.latitude_depart,
      longitude_depart: raw.longitude_depart,
      latitude_arrivee: raw.latitude_arrivee,
      longitude_arrivee: raw.longitude_arrivee,
      date_depart: raw.date_depart,
      heure_depart: raw.heure_depart,
      places_disponibles: raw.places_disponibles,
      prix_par_place: Number(raw.prix_par_place),
      type_reservation: raw.type_reservation as TypeReservation,
      statut: raw.statut as TrajetStatus,
      recurrence: raw.recurrence ?? null,
      preferences: raw.preferences ?? {},
      description: raw.description ?? null,
      date_creation: raw.date_creation,
      date_mise_a_jour: raw.date_mise_a_jour,
    });
  }

  static toResponseDto(entity: TrajetEntity): TrajetResponseDto {
    const dto = new TrajetResponseDto();
    dto.id = entity.id;
    dto.conducteur_id = entity.conducteur_id;
    dto.vehicule_id = entity.vehicule_id;
    dto.ville_depart = entity.ville_depart;
    dto.ville_arrivee = entity.ville_arrivee;
    dto.latitude_depart = entity.latitude_depart;
    dto.longitude_depart = entity.longitude_depart;
    dto.latitude_arrivee = entity.latitude_arrivee;
    dto.longitude_arrivee = entity.longitude_arrivee;
    dto.date_depart = entity.date_depart;
    dto.heure_depart = entity.heure_depart;
    dto.places_disponibles = entity.places_disponibles;
    dto.prix_par_place = entity.prix_par_place;
    dto.type_reservation = entity.type_reservation;
    dto.statut = entity.statut;
    dto.recurrence = entity.recurrence ?? null;
    dto.preferences = entity.preferences ?? {};
    dto.description = entity.description ?? null;
    dto.date_creation = entity.date_creation;
    dto.date_mise_a_jour = entity.date_mise_a_jour;
    return dto;
  }
}
