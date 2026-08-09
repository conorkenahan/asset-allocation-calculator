const LOCALE = 'en-US'

export function formatCrypto(value, maxDecimals) {
  const abs = Math.abs(value)
  const integerDigits = abs < 1 ? 0 : Math.trunc(abs).toString().length
  const decimals = Math.max(2, maxDecimals - integerDigits)
  return new Intl.NumberFormat(LOCALE, {
    minimumFractionDigits: 2,
    maximumFractionDigits: decimals,
  }).format(value)
}

export function formatUsd(value) {
  return new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

export function formatTime(date) {
  return new Intl.DateTimeFormat(LOCALE, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}
