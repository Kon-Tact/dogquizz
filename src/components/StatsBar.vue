<script setup lang="ts">
import { useGameStore } from '@/stores/game'
const game = useGameStore()
</script>

<template>
  <div class="footer">
    <div class="stat">Tentatives : <strong>{{ game.attempts.length }}</strong></div>
    <div class="stat">Correctes : <strong>{{ game.score.correct }}</strong></div>
    <div class="stat">Partielles : <strong>{{ game.score.partial }}</strong></div>
    <div class="stat">Incorrectes : <strong>{{ game.score.wrong }}</strong></div>
    <button class="btn" @click="game.reset()">Réinitialiser</button>
  </div>
  <div class="mode">Mode : {{ game.mode }}</div>
</template>
