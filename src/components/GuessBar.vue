<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { computed, ref, watch, Ref } from 'vue'
const game = useGameStore()
// réf des items pour l’autoscroll
const itemRefs: Ref<(HTMLElement | null)[]> = ref([])

// html escape (sécurité)
function escapeHtml(str: string) {
  return str.replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;',
    '"': '&quot;', "'": '&#39;'
  }[m]!))
}

const showDropdown = computed(() =>
  !!game.query &&
  orderedBreeds.value.length > 0 &&
  !orderedBreeds.value.some(
    b => b.breed.toLowerCase() === game.query.toLowerCase()
  )
)

const orderedBreeds = computed(() => {
  const qRaw = game.query.trim()
  const q = qRaw.toLowerCase()

  if (!q) return game.filteredBreeds

  type Breed = (typeof game.filteredBreeds)[number]

  const tier1: Breed[] = []
  const tier2: Breed[] = []

  for (const b of game.filteredBreeds) {
    const name = b.breed.toLowerCase()

    if (name.startsWith(q)) {
      tier1.push(b)
    } else if (name.includes(q)) {
      tier2.push(b)
    }
  }

  return [...tier1, ...tier2]
})


const highlightIndex = ref(-1)

// mise en évidence des correspondances
const highlightText = (name: string) => {
  const q = game.query.trim()
  if (!q) return escapeHtml(name)

  const regex = new RegExp(`(${q})`, 'gi')
  return escapeHtml(name).replace(regex, '<mark>$1</mark>')
}

watch(highlightIndex, () => {
  const el = itemRefs.value[highlightIndex.value]
  if (el) {
    el.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    })
  }
})

function selectBreedByIndex(index: number) {
  const item = orderedBreeds.value[index]
  if (!item) return
  game.query = item.breed
  game.submitGuess()
  highlightIndex.value = -1
}

function onKeydown(event: KeyboardEvent) {
  if (!showDropdown.value || !orderedBreeds.value.length) {
    if (event.key === 'Enter') {
      game.submitGuess()
    }
    return
  }

  switch (event.key) {

    case 'ArrowDown':
      event.preventDefault()
      if (highlightIndex.value < orderedBreeds.value.length - 1) {
        highlightIndex.value++
      } else {
        highlightIndex.value = 0
      }
      break

    case 'ArrowUp':
      event.preventDefault()
      if (highlightIndex.value > 0) {
        highlightIndex.value--
      } else {
        highlightIndex.value = orderedBreeds.value.length - 1
      }
      break

    case 'Enter':
      event.preventDefault()
      if (highlightIndex.value === -1) {
        // rien de sélectionné → on prend le 1er
        selectBreedByIndex(0)
      } else {
        selectBreedByIndex(highlightIndex.value)
      }
      break

    case 'Escape':
      highlightIndex.value = -1
      break
  }
}

watch(
  () => game.query,
  () => {
    highlightIndex.value = -1
  }
)

</script>

<template>
  <div class="toolbar">
    <div class="search">
      <input type="text" v-model="game.query" @keydown="onKeydown" placeholder="Devine la race…" />
      <div class="dropdown" v-if="showDropdown">
        <button v-for="(b, index) in orderedBreeds" :key="b.id"
          :ref="el => { itemRefs[index] = el as HTMLElement | null }"
          @click="game.query = b.breed; game.submitGuess()"
          :class="['dropdown-item', { active: index === highlightIndex }]">
          <span v-html="highlightText(b.breed)"></span>
        </button>
      </div>
    </div>
    <button class="btn primary" @click="game.submitGuess()">Valider</button>
    <button class="btn ghost" @click="game.newTarget()">Nouvelle énigme</button>
  </div>
</template>
