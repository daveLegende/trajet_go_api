export class AvisEntity {
  id: string;
  auteur_id: string;
  cible_id: string;
  trajet_id: string;
  note: number;
  commentaire: string | null;
  date_creation: Date;

  constructor(partial: Partial<AvisEntity>) {
    Object.assign(this, partial);
  }
}
