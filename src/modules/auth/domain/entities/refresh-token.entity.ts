export class RefreshTokenEntity {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: Date;
  revoked: boolean;
  created_at: Date;

  constructor(partial: Partial<RefreshTokenEntity>) {
    Object.assign(this, partial);
  }

  isExpired(): boolean {
    return new Date() > this.expires_at;
  }

  isValid(): boolean {
    return !this.revoked && !this.isExpired();
  }
}
