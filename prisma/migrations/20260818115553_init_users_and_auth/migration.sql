-- CreateEnum
CREATE TYPE "TypeUtilisateur" AS ENUM ('PASSAGER', 'CONDUCTEUR', 'LES_DEUX', 'ADMIN');

-- CreateEnum
CREATE TYPE "StatutVerification" AS ENUM ('NON_VERIFIE', 'EN_ATTENTE', 'VERIFIE');

-- CreateEnum
CREATE TYPE "StatutCompte" AS ENUM ('ACTIF', 'SUSPENDU', 'SUPPRIME');

-- CreateTable
CREATE TABLE "utilisateurs" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "mot_de_passe_hash" TEXT NOT NULL,
    "date_naissance" TIMESTAMP(3),
    "photo_profil_url" TEXT,
    "type_utilisateur" "TypeUtilisateur" NOT NULL DEFAULT 'PASSAGER',
    "statut_verification" "StatutVerification" NOT NULL DEFAULT 'NON_VERIFIE',
    "piece_identite_url" TEXT,
    "note_moyenne" DECIMAL(3,2) NOT NULL DEFAULT 0.0,
    "nombre_trajets" INTEGER NOT NULL DEFAULT 0,
    "langue_preferee" TEXT NOT NULL DEFAULT 'fr',
    "statut_compte" "StatutCompte" NOT NULL DEFAULT 'ACTIF',
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_derniere_connexion" TIMESTAMP(3),

    CONSTRAINT "utilisateurs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otp_verifications" (
    "id" TEXT NOT NULL,
    "cible" TEXT NOT NULL,
    "code_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "verifie" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "otp_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "utilisateurs_email_key" ON "utilisateurs"("email");

-- CreateIndex
CREATE UNIQUE INDEX "utilisateurs_telephone_key" ON "utilisateurs"("telephone");

-- CreateIndex
CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens"("user_id");

-- CreateIndex
CREATE INDEX "otp_verifications_cible_idx" ON "otp_verifications"("cible");

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "utilisateurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
