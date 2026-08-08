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
  <label for="amount">Investable assets (USD)</label>
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

<style scoped>
label {
  display: block;
  margin-bottom: var(--space-2);
  color: var(--color-ink-soft);
  font-size: 0.875rem;
}

input {
  display: block;
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-line);
  border-radius: var(--radius);
  background: var(--color-surface);
  color: var(--color-ink);
  font-family: var(--font-sans);
  font-size: 1rem;
}

input[aria-invalid='true'] {
  border-color: var(--color-error);
}

#amount-error {
  margin: var(--space-2) 0 0;
  color: var(--color-error);
  font-size: 0.875rem;
}
</style>
