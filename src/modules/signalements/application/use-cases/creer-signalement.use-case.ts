import { Injectable, Inject } from '@nestjs/common';
import {
  SIGNALEMENT_REPOSITORY,
  SignalementRepositoryPort,
  CreateSignalementInput,
} from '../../domain/repositories/signalements.repository';
import { Signalement } from '../../domain/entities/signalement.entity';
import { CreateNotificationUseCase } from '../../../notifications/application/use-cases/create-notification.use-case';
import { TypeNotification } from '../../../notifications/domain/entities/notification.entity';

@Injectable()
export class CreerSignalementUseCase {
  constructor(
    @Inject(SIGNALEMENT_REPOSITORY)
    private readonly signalementRepository: SignalementRepositoryPort,
    private readonly createNotificationUseCase: CreateNotificationUseCase,
  ) {}

  async execute(input: CreateSignalementInput): Promise<Signalement> {
    const signalement = await this.signalementRepository.create(input);

    // Notification système aux admins (ici représentés par un ID générique ou via broadcast si géré plus tard)
    // Pour l'instant on se contente de notifier la création de manière asynchrone si besoin.
    // Ex: this.createNotificationUseCase.execute({ userId: 'admin_id', type: SYSTEME ... })

    return signalement;
  }
}
