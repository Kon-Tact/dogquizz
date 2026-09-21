<script setup lang="ts">
import { useGameStore } from '@/stores/game'
const game = useGameStore()
const cls = (s: 'ok' | 'mid' | 'ko') =>
  s === 'ok' ? 'pill ok' : s === 'mid' ? 'pill mid' : 'pill ko'
</script>

<template>
  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Race proposée</th><th>Origine</th><th>Taille</th><th>Poids</th>
          <th>Poil</th><th>Énergie</th><th>Type</th><th>Robe</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="a in game.attempts" :key="a.id">
          <td class="breed-col">{{ a.breed }}</td>
          <td><span class="pill" :class="cls(a._cmp.origin.state)">{{ a.features.origin?.join(', ') || '—' }}</span></td>
          <td><span class="pill" :class="cls(a._cmp.size.state)">{{ a.features.size || '—' }}
            <span class="small" v-if="a._cmp.size.hint">({{ a._cmp.size.hint }})</span></span></td>
          <td><span class="pill" :class="cls(a._cmp.weight.state)">{{ a.features.weight || '—' }}
            <span class="small" v-if="a._cmp.weight.hint">({{ a._cmp.weight.hint }})</span></span></td>
          <td><span class="pill" :class="cls(a._cmp.poil.state)">{{ a.features.poil || '—' }}</span></td>
          <td><span class="pill" :class="cls(a._cmp.energy.state)">{{ a.features.energy || '—' }}</span></td>
          <td><span class="pill" :class="cls(a._cmp.type.state)">{{ a.features.type?.join(', ') || '—' }}</span></td>
          <td><span class="pill" :class="cls(a._cmp.robe.state)">{{ a.features.robe?.join(', ') || '—' }}</span></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
