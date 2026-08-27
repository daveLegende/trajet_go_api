// @ts-nocheck
import { PrismaClient } from '../generated/prisma/client';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');
  
  // Clear existing data (optional but good for clean seed)
  await prisma.notification.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversationParticipant.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.alerteSos.deleteMany();
  await prisma.signalement.deleteMany();
  await prisma.avis.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.pointArret.deleteMany();
  await prisma.trajet.deleteMany();
  await prisma.vehicule.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Create ADMIN
  const admin = await prisma.user.create({
    data: {
      nom: 'Admin',
      prenom: 'Super',
      email: 'admin@trajetgo.com',
      telephone: '+33600000000',
      mot_de_passe_hash: passwordHash,
      type_utilisateur: 'ADMIN',
      statut_verification: 'VERIFIE',
    },
  });
  console.log('Admin created.');

  // 2. Create 10 PASSENGERS
  const passengers = [];
  for (let i = 1; i <= 10; i++) {
    passengers.push(
      await prisma.user.create({
        data: {
          nom: `PassagerNom${i}`,
          prenom: `PassagerPrenom${i}`,
          email: `passager${i}@example.com`,
          telephone: `+336100000${i.toString().padStart(2, '0')}`,
          mot_de_passe_hash: passwordHash,
          type_utilisateur: 'PASSAGER',
          statut_verification: 'VERIFIE',
        },
      })
    );
  }
  console.log('10 Passengers created.');

  // 3. Create 5 DRIVERS
  const drivers = [];
  for (let i = 1; i <= 5; i++) {
    drivers.push(
      await prisma.user.create({
        data: {
          nom: `ConducteurNom${i}`,
          prenom: `ConducteurPrenom${i}`,
          email: `conducteur${i}@example.com`,
          telephone: `+336200000${i.toString().padStart(2, '0')}`,
          mot_de_passe_hash: passwordHash,
          type_utilisateur: 'CONDUCTEUR',
          statut_verification: 'VERIFIE',
        },
      })
    );
  }
  console.log('5 Drivers created.');

  // 4. Create 5 BOTH (LES_DEUX)
  const bothUsers = [];
  for (let i = 1; i <= 5; i++) {
    bothUsers.push(
      await prisma.user.create({
        data: {
          nom: `MixteNom${i}`,
          prenom: `MixtePrenom${i}`,
          email: `mixte${i}@example.com`,
          telephone: `+336300000${i.toString().padStart(2, '0')}`,
          mot_de_passe_hash: passwordHash,
          type_utilisateur: 'LES_DEUX',
          statut_verification: 'VERIFIE',
        },
      })
    );
  }
  console.log('5 Both Users created.');

  // 5. Create VEHICLES for Drivers and Both
  const allDrivers = [...drivers, ...bothUsers];
  const vehicles = [];
  for (let i = 0; i < allDrivers.length; i++) {
    vehicles.push(
      await prisma.vehicule.create({
        data: {
          proprietaire_id: allDrivers[i].id,
          marque: i % 2 === 0 ? 'Peugeot' : 'Renault',
          modele: i % 2 === 0 ? '208' : 'Clio',
          couleur: 'Blanc',
          immatriculation: `AB-${100 + i}-CD`,
          nombre_places: 4,
          annee: 2020,
          statut_verification: 'VERIFIE',
        },
      })
    );
  }
  console.log('10 Vehicles created.');

  // 6. Create TRAJETS (Rides)
  const trajets = [];
  for (let i = 0; i < 8; i++) {
    const driver = allDrivers[i];
    const vehicle = vehicles.find(v => v.proprietaire_id === driver.id);
    
    trajets.push(
      await prisma.trajet.create({
        data: {
          conducteur_id: driver.id,
          vehicule_id: vehicle!.id,
          ville_depart: 'Paris',
          ville_arrivee: 'Lyon',
          latitude_depart: 48.8566,
          longitude_depart: 2.3522,
          latitude_arrivee: 45.7640,
          longitude_arrivee: 4.8357,
          date_depart: new Date(Date.now() + 86400000 * (i + 1)), // In the future
          heure_depart: '08:00',
          places_disponibles: 3,
          prix_par_place: 30.00,
          type_reservation: 'INSTANT',
          statut: 'OUVERT',
        },
      })
    );
  }
  console.log('8 Trajets created.');

  // 7. Create RESERVATIONS
  const reservations = [];
  for (let i = 0; i < 6; i++) {
    reservations.push(
      await prisma.reservation.create({
        data: {
          trajet_id: trajets[i].id,
          passager_id: passengers[i].id,
          places_reservees: 1,
          montant_total: trajets[i].prix_par_place,
          statut: 'ACCEPTEE',
        },
      })
    );
  }
  console.log('6 Reservations created.');

  // 8. Create AVIS (Reviews)
  await prisma.avis.create({
    data: {
      trajet_id: trajets[0].id,
      auteur_id: passengers[0].id,
      cible_id: allDrivers[0].id,
      note: 5,
      commentaire: 'Super trajet !',
    }
  });
  console.log('Avis created.');

  // 9. Create SIGNALEMENT
  await prisma.signalement.create({
    data: {
      auteur_id: passengers[1].id,
      cible_id: allDrivers[1].id,
      trajet_id: trajets[1].id,
      motif: 'CONDUITE_DANGEREUSE',
      description: 'Roule trop vite.',
      statut: 'EN_ATTENTE',
    }
  });
  console.log('Signalement created.');

  // 10. Create ALERTE SOS
  await prisma.alerteSos.create({
    data: {
      utilisateur_id: passengers[2].id,
      trajet_id: trajets[2].id,
      latitude: 47.0,
      longitude: 3.0,
      statut: 'ACTIVE',
    }
  });
  console.log('Alerte SOS created.');

  // 11. Create CONVERSATION
  const conversation = await prisma.conversation.create({
    data: {
      trajet_id: trajets[0].id,
      participants: {
        create: [
          { user_id: passengers[0].id },
          { user_id: allDrivers[0].id },
        ]
      },
      messages: {
        create: [
          {
            expediteur_id: passengers[0].id,
            contenu: 'Bonjour, où se donne-t-on rendez-vous ?'
          }
        ]
      }
    }
  });
  console.log('Conversation created.');

  console.log('Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
