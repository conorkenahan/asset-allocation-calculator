<script setup>
import { ref, computed } from 'vue'
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
function handleInput(event) {
  const sanitized = event.target.value.replace(/[^0-9.,$]/g, '')
  amount.value = sanitized

  // If we stripped something, the DOM still shows the raw text,
  // so push the clean version back into the field
  if (sanitized !== event.target.value) {
    event.target.value = sanitized
  }
}

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
  <label for="amount">Amount</label>
  <input
    id="amount"
    :value="amount"
    @input="handleInput"
    :aria-describedby="showError ? 'amount-error' : undefined"
    :aria-invalid="showError ? 'true' : 'false'"
    type="text"
    inputmode="decimal"
  />
  <p v-if="showError" id="amount-error">{{ error }}</p>

  <div aria-live="polite">
    <p v-if="status === 'loading'">Loading rates…</p>

    <div v-else-if="status === 'error'">
      <p>Couldn't load exchange rates.</p>
      <button @click="refresh">Try again</button>
    </div>

    <div v-else>
      <template v-if="results.length">
        <div v-for="result in results" :key="result.symbol" class="result">
          <h2>{{ result.percent }}% {{ result.symbol }} allocation</h2>
          <p class="result__amount">{{ formatCrypto(result.crypto, result.decimals) }}</p>
          <p class="result__usd">{{ formatUsd(result.usd) }}</p>
        </div>
        <button @click="reverse">Reverse split</button>
        <p>Rates as of {{ formatTime(fetchedAt) }}</p>
        <button @click="refresh">Refresh rates</button>
      </template>
      <p v-else>Enter an amount to see your allocation.</p>
    </div>
  </div>
</template>
