<script setup>
const percent = defineModel({ type: Number, required: true })

const props = defineProps({
  assets: {
    type: Array,
    required: true,
    validator: (value) => value.length === 2,
  },
})
</script>

<template>
  <div class="allocation-slider">
    <div class="allocation-slider__labels">
      <span>{{ props.assets[0].symbol }} {{ props.assets[0].percent }}%</span>
      <span>{{ props.assets[1].symbol }} {{ props.assets[1].percent }}%</span>
    </div>
    <input
      v-model.number="percent"
      class="allocation-slider__input"
      type="range"
      min="0"
      max="100"
      step="1"
      :aria-valuetext="`${props.assets[0].symbol} ${props.assets[0].percent} percent, ${props.assets[1].symbol} ${props.assets[1].percent} percent`"
      :aria-label="`Allocation split between ${props.assets[0].symbol} and ${props.assets[1].symbol}`"
    />
  </div>
</template>

<style scoped>
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
</style>
