// Normalisation & comparaison de features
export type Features = {
  origin?: string[];
  size?: string;    // ex: "25 à 50 cm"
  weight?: string;  // ex: "6 à 8 kgs"
  robe?: string[];
  poil?: string;
  energy?: string;
  type?: string[];
};

export type Breed = {
  id: number;
  breed: string;
  features: Features;
  alias?: string[];
};

export type CmpState = 'ok' | 'mid' | 'ko';

export type CmpResult = {
  origin: { state: CmpState };
  size: { state: CmpState; hint?: string };
  weight: { state: CmpState; hint?: string };
  poil: { state: CmpState };
  energy: { state: CmpState };
  type: { state: CmpState };
  robe: { state: CmpState };
};

export const clean = (s?: string) =>
  (s || '')
    .toString()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();

export const parseRange = (text?: string): [number, number] | null => {
  if (!text) return null;
  const m = text.match(/(\d+(?:[.,]\d+)?)/g);
  if (!m) return null;
  const nums = m.map((v) => parseFloat(v.replace(',', '.')));
  if (nums.length === 1) return [nums[0], nums[0]];
  const a = Math.min(nums[0], nums[1]);
  const b = Math.max(nums[0], nums[1]);
  return [a, b];
};

const cmpRange = (aText?: string, bText?: string): { state: CmpState; hint?: string } => {
  const a = parseRange(aText), b = parseRange(bText);
  if (!a || !b) return { state: 'ko' };
  const [a1, a2] = a, [b1, b2] = b;
  const overlap = Math.max(0, Math.min(a2, b2) - Math.max(a1, b1));
  if (a1 === b1 && a2 === b2) return { state: 'ok' };
  if (overlap > 0) return { state: 'mid', hint: '' };
  if (a2 < b1) return { state: 'ko', hint: 'trop petit' };
  if (a1 > b2) return { state: 'ko', hint: 'trop grand' };
  return { state: 'ko' };
};

const cmpArray = (a?: string[], b?: string[]): { state: CmpState } => {
  const A = (a || []).map(clean), B = (b || []).map(clean);
  if (A.length && A.every((x) => B.includes(x)) && B.every((x) => A.includes(x))) return { state: 'ok' };
  const inter = A.filter((x) => B.includes(x));
  return inter.length ? { state: 'mid' } : { state: 'ko' };
};

const cmpText = (a?: string, b?: string): { state: CmpState } =>
  !a || !b ? { state: 'ko' } : clean(a) === clean(b) ? { state: 'ok' } : { state: 'ko' };

export const compareBreed = (guess: Breed, target: Breed): CmpResult => ({
  origin: cmpArray(guess.features.origin, target.features.origin),
  size: cmpRange(guess.features.size, target.features.size),
  weight: cmpRange(guess.features.weight, target.features.weight),
  poil: cmpText(guess.features.poil, target.features.poil),
  energy: cmpText(guess.features.energy, target.features.energy),
  type: cmpArray(guess.features.type, target.features.type),
  robe: cmpArray(guess.features.robe, target.features.robe),
});

export const prettyFeatures = (f: Features) => ({
  Origine: f.origin?.join(', '),
  Taille: f.size,
  Poids: f.weight,
  Poil: f.poil,
  Énergie: f.energy,
  Type: f.type?.join(', '),
  Robe: f.robe?.join(', '),
});
