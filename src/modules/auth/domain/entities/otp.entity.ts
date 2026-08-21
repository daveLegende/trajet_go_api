export class OtpEntity {
  id: string;
  cible: string;
  code_hash: string;
  expires_at: Date;
  verifie: boolean;
  created_at: Date;

  constructor(partial: Partial<OtpEntity>) {
    Object.assign(this, partial);
  }

  isExpired(): boolean {
    return new Date() > this.expires_at;
  }

  isValid(): boolean {
    return !this.verifie && !this.isExpired();
  }
}
