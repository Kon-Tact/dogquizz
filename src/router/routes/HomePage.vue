<script setup lang="ts">
import GuessBar from '@/components/GuessBar.vue'
import BreedTable from '@/components/BreedTable.vue'
import StatsBar from '@/components/StatsBar.vue'
import { useGameStore } from '@/stores/game'
import { onMounted } from 'vue'

const game = useGameStore()
onMounted(() => game.init())
</script>

<template>
  <section>
    <header style="text-align:center; margin-bottom:12px;">
      <h2>Devine Chieng</h2>
    </header>

    <GuessBar />

    <BreedTable v-if="game.attempts.length" />
    <div v-else></div>

    <StatsBar style="margin-top:12px;" />
  </section>
</template>
