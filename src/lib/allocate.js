import { MAX_AMOUNT } from '../config/assets.js'

export function allocate(usdAmount, rate, percent) {
  const usd = usdAmount * (percent / 100)
  const crypto = usd * rate

  return { usd, crypto }
}

export function parseAmount(input) {
  const cleaned = String(input).replace(/[$,\s]/g, '')
  if (cleaned === '' || cleaned === '.') return null
  return Number(cleaned)
}

export function validateAmount(input) {
  const value = parseAmount(input)

  if (value === null) return null
  if (Number.isNaN(value)) return 'Enter a number.'
  if (value < 0) return 'Enter an amount of 0 or more.'
  if (value > MAX_AMOUNT) {
    return `Enter an amount under ${MAX_AMOUNT.toLocaleString('en-US')}.`
  }
  return null
}
