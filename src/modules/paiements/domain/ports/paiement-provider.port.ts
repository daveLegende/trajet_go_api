export const PAYMENT_PROVIDER = 'PAYMENT_PROVIDER';

export interface InitiatePaymentPayload {
  montant: number;
  telephone: string;
  description: string;
  cle_idempotence: string;
}

export interface InitiatePaymentResult {
  success: boolean;
  reference?: string;
  message?: string;
}

/**
 * Port abstrait pour les fournisseurs de paiement Mobile Money.
 * Les implémentations concrètes (Flooz, T-Money, etc.) seront branchées ultérieurement.
 */
export interface PaymentProviderPort {
  initiatePayment(payload: InitiatePaymentPayload): Promise<InitiatePaymentResult>;
}
