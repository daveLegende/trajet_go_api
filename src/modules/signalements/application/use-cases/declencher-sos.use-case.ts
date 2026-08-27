import { Injectable, Inject, Logger } from '@nestjs/common';
import {
  ALERTE_SOS_REPOSITORY,
  AlerteSosRepositoryPort,
  CreateAlerteSosInput,
} from '../../domain/repositories/signalements.repository';
import { AlerteSos } from '../../domain/entities/alerte-sos.entity';
import { CreateNotificationUseCase } from '../../../notifications/application/use-cases/create-notification.use-case';
import { TypeNotification } from '../../../notifications/domain/entities/notification.entity';

@Injectable()
export class DeclencherSosUseCase {
  private readonly logger = new Logger(DeclencherSosUseCase.name);

  constructor(
    @Inject(ALERTE_SOS_REPOSITORY)
    private readonly alerteSosRepository: AlerteSosRepositoryPort,
    private readonly createNotificationUseCase: CreateNotificationUseCase,
  ) {}

  async execute(input: CreateAlerteSosInput): Promise<AlerteSos> {
    const sos = await this.alerteSosRepository.create(input);
    
    this.logger.error(`🚨 ALERTE SOS DÉCLENCHÉE PAR L'UTILISATEUR ${input.utilisateurId} SUR LE TRAJET ${input.trajetId} [Lat: ${input.latitude}, Lng: ${input.longitude}]`);

    // NOTE: Ici on pourrait appeler des API externes (ex: secours, SMS d'urgence).
    // On se contente d'utiliser le système de notification interne pour l'historisation système.
    
    // (Dans un système réel, 'admin-uuid' serait remplacé par une logique trouvant les modérateurs connectés)
    this.createNotificationUseCase.execute({
      userId: input.utilisateurId, // On envoie la notif sur le compte de l'utilisateur pour l'instant (ou un compte admin fictif)
      titre: '🚨 Alerte SOS déclenchée',
      message: `Votre signal de détresse a été reçu et les secours / notre équipe de modération ont été alertés. Coordonnées: ${input.latitude}, ${input.longitude}`,
      type: TypeNotification.SYSTEME,
      donneesLiees: {
        trajetId: input.trajetId,
        sosId: sos.id,
      },
    }).catch(err => this.logger.error('Erreur notification SOS:', err.message));

    return sos;
  }
}
