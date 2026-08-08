<script setup>
import { ref, computed } from 'vue'
import AmountInput from './components/AmountInput.vue'
import AllocationResult from './components/AllocationResult.vue'
import { ASSETS, DEFAULT_ALLOCATION } from './config/assets.js'
import { allocate, parseAmount, validateAmount } from './lib/allocate.js'
import { formatCrypto, formatUsd, formatTime } from './lib/format.js'
import { useExchangeRates } from './composables/useExchangeRates.js'

const { rates, status, fetchedAt, refresh } = useExchangeRates()

const amount = ref('')
const allocation = ref([...DEFAULT_ALLOCATION])

const error = computed(() => validateAmount(amount.value))
const showError = computed(() => error.value !== null)

const results = computed(() => {
  const value = parseAmount(amount.value)

  if (status.value !== 'ready') return []
  if (value === null || Number.isNaN(value)) return []
  if (error.value) return []

  return allocation.value.map(({ symbol, percent }) => {
    const asset = ASSETS[symbol]
    const { usd, crypto } = allocate(value, rates.value[symbol], percent)
    return { ...asset, percent, usd, crypto }
  })
})

function reverse() {
  const [a, b] = allocation.value
  allocation.value = [
    { ...a, percent: b.percent },
    { ...b, percent: a.percent },
  ]
}
</script>

<template>
  <h1>Asset Allocation Calculator</h1>
  <AmountInput v-model="amount" :error="error" />

  <div aria-live="polite">
    <p v-if="status === 'loading'">Loading rates…</p>

    <div v-else-if="status === 'error'">
      <p>Couldn't load exchange rates.</p>
      <button @click="refresh">Try again</button>
    </div>

    <div v-else>
      <template v-if="results.length">
        <AllocationResult v-for="result in results" :key="result.symbol" :result="result" />
        <button @click="reverse">Reverse split</button>
        <p>Rates as of {{ formatTime(fetchedAt) }}</p>
        <button @click="refresh">Refresh rates</button>
      </template>
      <p v-else>Enter an amount to see your allocation.</p>
    </div>
  </div>
</template>
