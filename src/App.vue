<script setup lang="ts">
</script>

<template>
  <div class="container">
    <header style="display:flex; justify-content: space-between; align-items:center;">
      <h1>🚀 Vue Starter</h1>
      <nav>
        <RouterLink to="/" active-class="active">Accueil</RouterLink>
        <RouterLink to="/about" active-class="active">À propos</RouterLink>
      </nav>
    </header>

    <main class="card">
      <RouterView />
    </main>

    <footer style="margin-top:24px; color:#667;">
      Base Vue 3 + Vite + TS + Router + Pinia
    </footer>
  </div>
</template>