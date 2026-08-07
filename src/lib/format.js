const LOCALE = 'en-US'

export function formatCrypto(value, decimals) {
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
