<script setup>
import { formatCrypto, formatUsd } from '../lib/format.js'

defineProps({
  result: { type: Object, required: true },
})
</script>

<template>
  <h2>{{ result.percent }}% {{ result.symbol }} allocation</h2>
  <p class="result__amount">{{ formatCrypto(result.crypto, result.decimals) }}</p>
  <p class="result__usd">{{ formatUsd(result.usd) }}</p>
</template>
