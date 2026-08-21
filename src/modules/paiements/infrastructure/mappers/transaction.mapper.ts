import {
  TransactionEntity,
  TransactionStatus,
  TransactionType,
} from '../../domain/entities/transaction.entity';

export class TransactionMapper {
  static toDomain(raw: any): TransactionEntity {
    return new TransactionEntity({
      id: raw.id,
      portefeuille_id: raw.portefeuille_id,
      reservation_id: raw.reservation_id ?? null,
      type: raw.type as TransactionType,
      montant: Number(raw.montant),
      statut: raw.statut as TransactionStatus,
      cle_idempotence: raw.cle_idempotence,
      description: raw.description ?? null,
      date_creation: new Date(raw.date_creation),
      date_mise_a_jour: new Date(raw.date_mise_a_jour),
    });
  }
}
