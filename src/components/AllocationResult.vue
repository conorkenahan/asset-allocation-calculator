<script setup>
import { formatCrypto, formatUsd } from '../lib/format.js'

defineProps({
  result: { type: Object, required: true },
})
</script>

<template>
  <h2>{{ result.percent }}% {{ result.symbol }} allocation</h2>
  <p class="result__amount" :data-symbol="result.symbol">
    {{ formatCrypto(result.crypto, result.maxDecimals) }}
  </p>
  <p class="result__usd">{{ formatUsd(result.usd) }}</p>
</template>

<style scoped>
h2 {
  margin: var(--space-6) 0 var(--space-1);
  font-family: var(--font-sans);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-ink-soft);
}

.result__amount {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 1.5rem;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  color: var(--color-blue);
}

.result__amount[data-symbol='ETH'] {
  color: var(--color-ink);
}

.result__usd {
  margin: var(--space-1) 0 0;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  font-variant-numeric: tabular-nums;
  color: var(--color-ink-soft);
}
</style>
