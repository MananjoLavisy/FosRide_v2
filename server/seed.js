require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const User = require('./models/User');
const Driver = require('./models/Driver');
const FAQ = require('./models/FAQ');

const faqs = [
  {
    question_fr: 'Comment demander un trajet ?',
    question_en: 'How do I request a ride?',
    question_mg: 'Ahoana ny fomba fangatahana dia?',
    answer_fr: 'Connectez-vous en tant que passager, allez dans "Demander un Trajet", choisissez votre type de transport, indiquez votre départ et destination, puis validez votre demande.',
    answer_en: 'Log in as a passenger, go to "Request a Ride", choose your transport type, enter your departure and destination, then submit your request.',
    answer_mg: 'Midira amin\'ny maha-mpandeha anao, mandehana any amin\'ny "Mangataka dia", safidio ny karazana fitaterana, ampidiro ny fiaingana sy ny toerana aleha, dia alefaso ny fangatahana.',
    category: 'rides',
    order: 1,
  },
  {
    question_fr: 'Comment fonctionne le système de prix ?',
    question_en: 'How does the pricing system work?',
    question_mg: 'Ahoana ny fiasan\'ny rafitra vidiny?',
    answer_fr: 'Après votre demande, les chauffeurs vous envoient leurs offres de prix. Vous pouvez comparer et accepter l\'offre qui vous convient. Une réduction de 10% est accordée sur votre premier trajet !',
    answer_en: 'After your request, drivers send you their price offers. You can compare and accept the offer that suits you. A 10% discount is applied to your first ride!',
    answer_mg: 'Rehefa alefanao ny fangatahana, ny mpamily dia mandefa ny tolotra vidiny. Afaka mampitaha sy manaiky ny tolotra tianao ianao. 10% fihenam-bidy amin\'ny dia voalohany!',
    category: 'payment',
    order: 2,
  },
  {
    question_fr: 'Quels moyens de paiement sont acceptés ?',
    question_en: 'What payment methods are accepted?',
    question_mg: 'Inona avy ny fomba fandoavana ekena?',
    answer_fr: 'Nous acceptons les espèces, MVola, Orange Money et Airtel Money. Choisissez votre méthode préférée lors de la demande de trajet.',
    answer_en: 'We accept cash, MVola, Orange Money and Airtel Money. Choose your preferred method when requesting a ride.',
    answer_mg: 'Mankasitraka vola madinika, MVola, Orange Money ary Airtel Money izahay. Safidio ny fomba tianao rehefa mangataka dia.',
    category: 'payment',
    order: 3,
  },
  {
    question_fr: 'Comment devenir chauffeur sur FosaRide ?',
    question_en: 'How do I become a driver on FosaRide?',
    question_mg: 'Ahoana ny fomba ho lasa mpamily amin\'ny FosaRide?',
    answer_fr: 'Inscrivez-vous en tant que chauffeur avec votre permis de conduire et CIN. Votre compte sera validé par un administrateur sous 24-48h.',
    answer_en: 'Register as a driver with your driver\'s license and national ID. Your account will be approved by an admin within 24-48 hours.',
    answer_mg: 'Misorata anarana amin\'ny maha-mpamily miaraka amin\'ny fahazoan-dàlana sy CIN. Ny kaontinao dia hankatoavin\'ny mpitantana ao anatin\'ny 24-48 ora.',
    category: 'drivers',
    order: 4,
  },
  {
    question_fr: 'Comment noter un chauffeur ?',
    question_en: 'How do I rate a driver?',
    question_mg: 'Ahoana ny fomba fanomezana naoty mpamily?',
    answer_fr: 'Après la fin de votre trajet, rendez-vous sur la page du trajet pour laisser un avis et une note (1 à 5 étoiles).',
    answer_en: 'After your ride is completed, go to the ride detail page to leave a review and rating (1 to 5 stars).',
    answer_mg: 'Rehefa vita ny dianao, mandehana any amin\'ny pejin\'ny dia mba hametraka hevitra sy naoty (1 ka hatramin\'ny 5 kintana).',
    category: 'reviews',
    order: 5,
  },
  {
    question_fr: 'Quels types de transport sont disponibles ?',
    question_en: 'What types of transport are available?',
    question_mg: 'Inona avy ny karazana fitaterana misy?',
    answer_fr: 'FosaRide propose : Voiture, Taxi, Moto, Bateau, et Lakana. La disponibilité dépend des chauffeurs dans votre zone.',
    answer_en: 'FosaRide offers: Car, Taxi, Motorcycle, Boat, and Canoe. Availability depends on drivers in your area.',
    answer_mg: 'FosaRide manolotra: Fiara, Taksy, Moto, Sambo, ary Lakana. Miankina amin\'ny mpamily eo amin\'ny faritrao ny fisiany.',
    category: 'general',
    order: 6,
  },
  {
    question_fr: 'Comment contacter le support ?',
    question_en: 'How do I contact support?',
    question_mg: 'Ahoana ny fomba hifandraisana amin\'ny fanampiana?',
    answer_fr: 'Accédez à la page Support depuis le menu, créez un ticket en décrivant votre problème. Notre équipe vous répondra dans les plus brefs délais.',
    answer_en: 'Go to the Support page from the menu, create a ticket describing your issue. Our team will respond as soon as possible.',
    answer_mg: 'Mandehana any amin\'ny pejin\'ny Fanampiana avy amin\'ny menu, mamorona ticket milazalaza ny olanao. Ny ekipanay dia hamaly haingana araka izay azo atao.',
    category: 'support',
    order: 7,
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // ── Admin 1: admin / dabou ──
  if (!(await Admin.findOne({ username: 'admin' }))) {
    await Admin.create({ username: 'admin', password: 'dabou' });
    console.log('Created ADMIN  ->  admin / dabou');
  } else {
    console.log('Admin "admin" already exists');
  }

  // ── Admin 2: admin2 / Lavisy ──
  if (!(await Admin.findOne({ username: 'admin2' }))) {
    await Admin.create({ username: 'admin2', password: 'Lavisy' });
    console.log('Created ADMIN  ->  admin2 / Lavisy');
  } else {
    console.log('Admin "admin2" already exists');
  }

  // ── Test user account for admin ──
  if (!(await User.findOne({ username: 'admin' }))) {
    await User.create({
      username: 'admin',
      email: 'admin@fosaride.com',
      password: 'dabou',
      mobileNumber: '0000000000',
    });
    console.log('Created USER   ->  admin / dabou');
  } else {
    console.log('User "admin" already exists');
  }

  // ── Test driver account for admin ──
  if (!(await Driver.findOne({ username: 'admin' }))) {
    await Driver.create({
      username: 'admin',
      email: 'admin@fosaride.com',
      password: 'dabou',
      mobileNumber: '0000000000',
      driverLicense: 'TEST-LICENSE-001',
      nationalID: 'TEST-NID-001',
      accountStatus: true,
      suspended: false,
    });
    console.log('Created DRIVER ->  admin / dabou  (pre-approved)');
  } else {
    console.log('Driver "admin" already exists');
  }

  // ── Seed FAQs ──
  const faqCount = await FAQ.countDocuments();
  if (faqCount === 0) {
    await FAQ.insertMany(faqs);
    console.log(`Seeded ${faqs.length} FAQs`);
  } else {
    console.log(`FAQs already exist (${faqCount}), skipping`);
  }

  await mongoose.disconnect();
  console.log('\nSeed complete!');
  console.log('  Admin 1:  admin  / dabou');
  console.log('  Admin 2:  admin2 / Lavisy');
  console.log('  (admin credentials auto-detected at login — no need to select Admin role)');
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
