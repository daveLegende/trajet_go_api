export class PortefeuilleEntity {
  id: string;
  user_id: string;
  solde: number;
  date_creation: Date;
  date_mise_a_jour: Date;

  constructor(partial: Partial<PortefeuilleEntity>) {
    Object.assign(this, partial);
  }

  credit(montant: number): void {
    if (montant <= 0) {
      throw new Error('Le montant du crédit doit être positif');
    }
    this.solde = Math.round((this.solde + montant) * 100) / 100;
  }

  debit(montant: number): void {
    if (montant <= 0) {
      throw new Error('Le montant du débit doit être positif');
    }
    if (this.solde < montant) {
      throw new Error('Solde insuffisant');
    }
    this.solde = Math.round((this.solde - montant) * 100) / 100;
  }
}
