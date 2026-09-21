import { defineStore } from 'pinia';
import breedsData from '@/assets/breeds.json';
import { Breed, CmpResult, compareBreed, clean } from '@/lib/compare';

// Mélange déterministe basé sur une seed
function seededShuffle<T>(array: T[], seed: number): T[] {
  const result = [...array];
  let currentIndex = result.length, randomIndex;

  while (currentIndex !== 0) {
    // Seed pseudo-aléatoire (linéar congruential)
    seed = (seed * 9301 + 49297) % 233280;
    const rnd = seed / 233280;

    randomIndex = Math.floor(rnd * currentIndex);
    currentIndex--;

    [result[currentIndex], result[randomIndex]] = [
      result[randomIndex],
      result[currentIndex],
    ];
  }

  return result;
}

// 🔹 Date de référence en UTC (1er janvier 2025 à minuit UTC)
const START_DATE_UTC = Date.UTC(2025, 0, 1); // mois = 0 → janvier

function getDailyBreed(breeds: Breed[], now = new Date()): Breed {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;

  // 🔹 On construit la date "aujourd'hui" en UTC (sans l'heure)
  const todayUTC = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  );

  // 🔹 Nombre de jours entiers depuis la date de départ (en UTC)
  const diffDays = Math.floor((todayUTC - START_DATE_UTC) / MS_PER_DAY);

  // 🔹 On boucle proprement sur la liste des races
  const index = ((diffDays % breeds.length) + breeds.length) % breeds.length;
  return breeds[index];
}

function getTodayUTCDateString(): string {
  const now = new Date();
  return `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}`;
}

export type Attempt = Breed & { _cmp: CmpResult };

export const useGameStore = defineStore('game', {
  state: () => ({
    breeds: breedsData as Breed[],
    target: null as Breed | null,
    attempts: [] as Attempt[],
    query: '' as string,
    mode: 'daily' as 'daily' | 'random',
  }),
  getters: {
    filteredBreeds(state) {
      const q = clean(state.query);

      // 1️⃣ races déjà tentées (normalisées)
      const tried = new Set(
        state.attempts.map(a => clean(a.breed))
      );

      // 2️⃣ liste pré-filtrée selon la recherche
      const matches = !q
        ? state.breeds
        : state.breeds.filter(b =>
          clean(b.breed).includes(q) ||
          (b.alias || []).some(a => clean(a).includes(q))
        );

      // 3️⃣ on enlève les races déjà tentées
      return matches.filter(b => !tried.has(clean(b.breed)));
    },
    score(state) {
      const flat = state.attempts.flatMap((a) => Object.values(a._cmp));
      return {
        correct: flat.filter((x) => x.state === 'ok').length,
        partial: flat.filter((x) => x.state === 'mid').length,
        wrong: flat.filter((x) => x.state === 'ko').length,
      };
    },
  },
  actions: {
    init() {
      const today = getTodayUTCDateString();
      const done = localStorage.getItem("daily_done");

      if (done === today) {
        // Le daily du jour est déjà fait → mode random
        this.mode = 'random';
        this.target = this.breeds[Math.floor(Math.random() * this.breeds.length)];
        console.log("🔁 Daily déjà trouvé → mode random");
        return;
      }

      // Sinon → daily normal
      this.mode = 'daily';
      this.target = getDailyBreed(this.breeds);
      console.log("🔥 Mode daily → Race du jour :", this.target.breed);
    },
    newTarget() {
      this.attempts = [];
      this.query = '';

      if (this.mode === 'daily') {
        this.target = getDailyBreed(this.breeds);
        console.log("🔥 Race du jour :", this.target.breed);
      } else {
        this.target = this.breeds[Math.floor(Math.random() * this.breeds.length)];
        console.log("🎲 Race random :", this.target.breed);
      }
    },
    reset() {
      this.attempts = [];
      this.query = '';
    },
    submitGuess() {
      const name = this.query?.trim();
      if (!name || !this.target) return;

      const guess = this.breeds.find(
        (b) =>
          clean(b.breed) === clean(name) ||
          (b.alias || []).some((a) => clean(a) === clean(name))
      );
      if (!guess) {
        alert('Race inconnue. Choisis dans la liste de suggestions.');
        return;
      }
      if (this.attempts.some((a) => a.breed === guess.breed)) {
        this.query = '';
        return;
      }
      const _cmp = compareBreed(guess, this.target);
      this.attempts.unshift({ ...guess, _cmp });
      this.query = '';

      if (Object.values(_cmp).every((v) => v.state === 'ok')) {
        setTimeout(() => alert('Bravo ! Tu as trouvé ✨'), 50);

        if (this.mode === 'daily') {
          this.mode = 'random';

          // 🔥 Enregistrer la daily trouvée
          const dateStr = getTodayUTCDateString();
          localStorage.setItem("daily_done", dateStr);

          console.log("🎉 Daily trouvée → sauvegardée :", dateStr);
        }
      }

    },
  },
});
