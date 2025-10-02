<script setup lang="ts">
import { useCounterStore } from '@/stores/counter'
const counter = useCounterStore()
</script>

<template>
  <section>
    <h2>Bienvenue 👋</h2>
    <p>Ce squelette est prêt pour démarrer votre application Vue 3.</p>
    <div style="display:flex; align-items:center; gap:12px; margin:16px 0;">
      <button class="btn" @click="counter.inc()">Compter: {{ counter.count }}</button>
      <button class="btn" @click="counter.reset()">Reset</button>
    </div>
    <p>Fichiers à regarder : <code>src/App.vue</code>, <code>src/components/HelloWorld.vue</code>, <code>src/router/index.ts</code>, <code>src/stores/counter.ts</code>.</p>
  </section>
</template>