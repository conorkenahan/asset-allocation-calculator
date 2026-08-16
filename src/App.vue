<script setup>
import { ref, computed } from 'vue'
import AmountInput from './components/AmountInput.vue'
import AllocationResult from './components/AllocationResult.vue'
import { ASSETS, DEFAULT_ALLOCATION } from './config/assets.js'
import { allocate, parseAmount, validateAmount } from './lib/allocate.js'
import { formatTime } from './lib/format.js'
import { useExchangeRates } from './composables/useExchangeRates.js'

const { rates, status, fetchedAt, refresh } = useExchangeRates()

const amount = ref('')
const allocation = ref([...DEFAULT_ALLOCATION])

const error = computed(() => validateAmount(amount.value))

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

const btcPercent = computed({
  get: () => allocation.value[0].percent,
  set(value) {
    const clamped = Math.min(100, Math.max(0, value))
    allocation.value = [
      { ...allocation.value[0], percent: clamped },
      { ...allocation.value[1], percent: 100 - clamped },
    ]
  },
})

function reverse() {
  btcPercent.value = 100 - btcPercent.value
}
</script>

<template>
  <div class="page">
    <h1>Asset Allocation Calculator</h1>
    <main class="layout">
      <section class="panel">
        <AmountInput v-model="amount" :error="error" />
      </section>
      <section class="panel panel--results" aria-live="polite">
        <p v-if="status === 'loading'" class="status-text status-text--center">Loading rates…</p>

        <div v-else-if="status === 'error'" class="status-block">
          <p class="status-text">Couldn't load exchange rates.</p>
          <button class="btn btn--primary" @click="refresh">Try again</button>
        </div>

        <div v-else>
          <template v-if="results.length">
            <AllocationResult v-for="result in results" :key="result.symbol" :result="result" />
            <div class="allocation-slider">
              <div class="allocation-slider__labels">
                <span>{{ allocation[0].symbol }} {{ allocation[0].percent }}%</span>
                <span>{{ allocation[1].symbol }} {{ allocation[1].percent }}%</span>
              </div>
              <input
                v-model.number="btcPercent"
                class="allocation-slider__input"
                type="range"
                min="0"
                max="100"
                step="1"
                :aria-valuetext="`${allocation[0].symbol} ${allocation[0].percent} percent, ${allocation[1].symbol} ${allocation[1].percent} percent`"
                aria-label="Allocation split between BTC and ETH"
              />
            </div>
            <button class="btn btn--ghost results-action" @click="reverse">
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <polyline points="17 4 21 8 17 12" />
                <line x1="21" y1="8" x2="4" y2="8" />
                <polyline points="7 20 3 16 7 12" />
                <line x1="3" y1="16" x2="20" y2="16" />
              </svg>
              Reverse split
            </button>
            <div class="results-footer">
              <p class="status-text">Rates as of {{ formatTime(fetchedAt) }}</p>
              <button class="btn btn--ghost" @click="refresh">Refresh rates</button>
            </div>
          </template>
          <p v-else class="status-text status-text--center">Enter an amount to see your allocation.</p>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.page {
  max-width: 64rem;
  margin: 0 auto;
  padding: var(--space-8) var(--space-4);
}

h1 {
  margin: 0 0 var(--space-6);
  font-size: 1.5rem;
}

.layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6);
}

@media (min-width: 48rem) {
  .layout {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-8);
  }
}

.panel {
  background: var(--color-surface);
  border: 1px solid var(--color-line);
  border-radius: var(--radius);
  padding: var(--space-6);
}

.panel--results {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

@media (min-width: 48rem) {
  .panel {
    padding: var(--space-8);
  }
}

.status-text {
  color: var(--color-ink-soft);
  margin: 0 0 var(--space-4);
}

.status-text--center {
  margin: 0;
  text-align: center;
}

.status-block {
  text-align: center;
}

.allocation-slider {
  margin-top: var(--space-6);
}

.allocation-slider__labels {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--space-2);
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  font-variant-numeric: tabular-nums;
  color: var(--color-ink-soft);
}

.allocation-slider__input {
  width: 100%;
  accent-color: var(--color-blue);
}

.results-action {
  margin-top: var(--space-6);
}

.results-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2) var(--space-4);
  margin-top: var(--space-6);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-line);
}

.results-footer .status-text {
  margin: 0;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius);
  font-family: var(--font-sans);
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition:
    background-color var(--transition),
    border-color var(--transition),
    color var(--transition),
    filter var(--transition);
}

.btn--primary {
  background: var(--color-blue);
  border: 1px solid var(--color-blue);
  color: white;
}

.btn--primary:hover {
  filter: brightness(0.9);
}

.btn--primary:active {
  filter: brightness(0.8);
}

.btn--ghost {
  background: transparent;
  border: 1px solid var(--color-line);
  color: var(--color-blue);
}

.btn--ghost:hover {
  background: var(--color-blue-wash);
}

.btn--ghost:active {
  background: var(--color-blue-wash);
  border-color: var(--color-blue);
}

@media (prefers-reduced-motion: reduce) {
  .btn {
    transition: none;
  }
}
</style>
