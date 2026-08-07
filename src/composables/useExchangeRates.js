import { ref, onMounted } from 'vue'

const ENDPOINT = 'https://api.coinbase.com/v2/exchange-rates?currency=USD'

export function useExchangeRates() {
  const rates = ref({})
  const status = ref('loading')
  const fetchedAt = ref(null)

  async function refresh() {
    status.value = 'loading'

    try {
      const response = await fetch(ENDPOINT)

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const { data } = await response.json()

      if (!data?.rates) {
        throw new Error('Unexpected response shape')
      }

      rates.value = Object.fromEntries(
        Object.entries(data.rates).map(([symbol, rate]) => [symbol, Number(rate)]),
      )
      fetchedAt.value = new Date()
      status.value = 'ready'
    } catch (err) {
      console.error('Could not load exchange rates:', err)
      status.value = 'error'
    }
  }

  onMounted(refresh)

  return {
    rates,
    status,
    fetchedAt,
    refresh,
  }
}
