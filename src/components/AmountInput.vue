<script setup>
const amount = defineModel({ type: String, default: '' })

defineProps({
  error: { type: String, default: null },
})

function handleInput(event) {
  const sanitized = event.target.value.replace(/[^0-9.,$]/g, '')
  amount.value = sanitized
  if (sanitized !== event.target.value) {
    event.target.value = sanitized
  }
}
</script>

<template>
  <label for="amount">Amount</label>
  <input
    id="amount"
    :value="amount"
    @input="handleInput"
    :aria-describedby="error ? 'amount-error' : undefined"
    :aria-invalid="error ? 'true' : 'false'"
    type="text"
    inputmode="decimal"
  />
  <p v-if="error" id="amount-error">{{ error }}</p>
</template>
