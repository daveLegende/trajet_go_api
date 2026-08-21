-- CreateTable
CREATE TABLE "avis" (
    "id" TEXT NOT NULL,
    "auteur_id" TEXT NOT NULL,
    "cible_id" TEXT NOT NULL,
    "trajet_id" TEXT NOT NULL,
    "note" INTEGER NOT NULL,
    "commentaire" TEXT,
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "avis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "avis_cible_id_idx" ON "avis"("cible_id");

-- CreateIndex
CREATE INDEX "avis_trajet_id_idx" ON "avis"("trajet_id");

-- CreateIndex
CREATE UNIQUE INDEX "avis_auteur_id_cible_id_trajet_id_key" ON "avis"("auteur_id", "cible_id", "trajet_id");

-- AddForeignKey
ALTER TABLE "avis" ADD CONSTRAINT "avis_auteur_id_fkey" FOREIGN KEY ("auteur_id") REFERENCES "utilisateurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avis" ADD CONSTRAINT "avis_cible_id_fkey" FOREIGN KEY ("cible_id") REFERENCES "utilisateurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avis" ADD CONSTRAINT "avis_trajet_id_fkey" FOREIGN KEY ("trajet_id") REFERENCES "trajets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
