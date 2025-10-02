import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 as number }),
  actions: {
    inc() { this.count += 1 },
    reset() { this.count = 0 }
  }
})