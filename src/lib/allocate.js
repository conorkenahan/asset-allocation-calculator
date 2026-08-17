import { MAX_AMOUNT } from '../config/assets.js'

export function splitUsd(usdAmount, percents) {
  const totalCents = Math.round(usdAmount * 100)
  let assigned = 0

  return percents.map((percent, i) => {
    const isLast = i === percents.length - 1
    const cents = isLast ? totalCents - assigned : Math.round((totalCents * percent) / 100)

    assigned += cents
    return cents / 100
  })
}

export function allocate(usd, rate) {
  return usd * rate
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
