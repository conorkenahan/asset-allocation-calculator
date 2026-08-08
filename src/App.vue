<script setup>
import { ref, computed, watchEffect } from 'vue'
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
  <div v-for="result in results" :key="result.symbol" class="result">
    <h2>{{ result.percent }}% {{ result.symbol }} allocation</h2>
    <p class="result__amount">{{ formatCrypto(result.crypto, result.decimals) }}</p>
    <p class="result__usd">{{ formatUsd(result.usd) }}</p>
  </div>
</template>
