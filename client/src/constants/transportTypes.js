export const TRANSPORT_TYPES = [
  { id: 'voiture', label: 'Voiture', icon: '\u{1F697}', desc: 'Confortable, 4 places' },
  { id: 'taxi',    label: 'Taxi',    icon: '\u{1F695}', desc: 'Rapide, disponible partout' },
  { id: 'moto',    label: 'Moto',    icon: '\u{1F3CD}', desc: 'Rapide, 1-2 places' },
  { id: 'bateau',  label: 'Bateau',  icon: '\u{26F4}',  desc: 'Traversée maritime' },
  { id: 'lakana',  label: 'Lakana',  icon: '\u{1F6F6}', desc: 'Pirogue traditionnelle' },
];

export const MAX_PASSENGERS = {
  voiture: 4,
  taxi: 4,
  moto: 2,
  bateau: 20,
  lakana: 6,
};

export const PAYMENT_METHODS = [
  { id: 'cash',         label: 'Espèces',      icon: '\u{1F4B5}' },
  { id: 'mvola',        label: 'MVola',         icon: '\u{1F4F1}' },
  { id: 'orange_money', label: 'Orange Money',  icon: '\u{1F4F2}' },
  { id: 'airtel_money', label: 'Airtel Money',  icon: '\u{1F4F3}' },
];
