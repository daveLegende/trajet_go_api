export enum TransactionStatus {
  EN_ATTENTE = 'EN_ATTENTE',
  REUSSIE = 'REUSSIE',
  ECHEC = 'ECHEC',
  REMBOURSEE = 'REMBOURSEE',
}

export enum TransactionType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
  REMBOURSEMENT = 'REMBOURSEMENT',
  PAIEMENT_RESERVATION = 'PAIEMENT_RESERVATION',
}

export class TransactionEntity {
  id: string;
  portefeuille_id: string;
  reservation_id: string | null;
  type: TransactionType;
  montant: number;
  statut: TransactionStatus;
  cle_idempotence: string;
  description: string | null;
  date_creation: Date;
  date_mise_a_jour: Date;

  constructor(partial: Partial<TransactionEntity>) {
    Object.assign(this, partial);
  }

  isReussie(): boolean {
    return this.statut === TransactionStatus.REUSSIE;
  }
}
