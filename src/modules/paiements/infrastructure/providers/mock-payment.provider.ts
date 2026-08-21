import { Injectable, Logger } from '@nestjs/common';
import {
  PaymentProviderPort,
  InitiatePaymentPayload,
  InitiatePaymentResult,
} from '../../domain/ports/paiement-provider.port';

/**
 * Implémentation mock du fournisseur de paiement.
 * Simule toujours un succès pour permettre le développement et les tests
 * sans branchement réel à un opérateur Mobile Money.
 *
 * TODO: Remplacer par FlooZPaymentProvider / TMoneyPaymentProvider à l'étape dédiée.
 */
@Injectable()
export class MockPaymentProvider implements PaymentProviderPort {
  private readonly logger = new Logger(MockPaymentProvider.name);

  async initiatePayment(payload: InitiatePaymentPayload): Promise<InitiatePaymentResult> {
    this.logger.log(
      `[MOCK] Initiation de paiement — montant: ${payload.montant} FCFA, idempotence: ${payload.cle_idempotence}`,
    );

    // Simule un délai réseau
    await new Promise((resolve) => setTimeout(resolve, 50));

    return {
      success: true,
      reference: `MOCK-${Date.now()}-${payload.cle_idempotence.substring(0, 8)}`,
      message: 'Paiement simulé avec succès (mode développement)',
    };
  }
}
