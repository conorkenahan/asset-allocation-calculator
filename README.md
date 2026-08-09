<img width="1014" height="553" alt="Screenshot 2026-08-09 at 10 50 11 AM" src="https://github.com/user-attachments/assets/e9dccd84-5790-464b-983c-1b5b1944b4af" />

# Asset Allocation Calculator

Takes a USD amount and calculates a 70/30 BTC/ETH split using live Coinbase
exchange rates. Built for the Justworks front end take-home.

## Running it

Requires Node 24 (see `.nvmrc`); run `nvm use`, then `npm install` runs clean.

```
npm install
npm run dev
```

Then open the printed localhost URL.

## Stack

Vue 3 (`<script setup>` / Composition API) and Vite. No other runtime
dependencies. Styling is plain scoped CSS over a small design-token layer.

## Structure

```
src/
├── App.vue                      state, the results join, layout
├── components/
│   ├── AmountInput.vue          input, sanitizing, error display
│   └── AllocationResult.vue     one result block, rendered per asset
├── composables/
│   └── useExchangeRates.js      fetch, status, refresh
├── lib/
│   ├── allocate.js              pure math + input parsing (no Vue imports)
│   └── format.js                Intl formatting helpers
├── config/
│   └── assets.js                supported assets, default split, input cap
└── styles/
    └── tokens.css               design tokens + base document styles
```

Components render, composables hold reactive logic, lib files are pure
functions. `allocate.js` imports nothing from Vue, so the math is easy to
test on its own. Validation stays in `App` so there's one source of truth
for what counts as valid; the input component just displays the result.

## A few decisions

- **One fetch, no polling.** The endpoint returns every rate in one
  response, so the app fetches once and recalculates locally. Rates
  shifting under someone mid-read seemed worse than slightly stale numbers,
  so staleness is shown ("Rates as of…") with a manual refresh instead.
- **Input is filtered, not error-messaged.** The amount field strips
  characters that can never be part of a valid amount as you type, the
  usual convention for money inputs. Commas and a leading $ are accepted.
  The only remaining error worth showing is the input cap, which appears
  immediately.
- **A failed fetch is visible.** Plain message plus a retry button, no
  masking. Retry and refresh call the same function.
- **Crypto precision scales with size.** Decimals shrink as the number
  grows (floored at 2) and cap at 8 per asset, enough for BTC down to the
  satoshi and a sensible ceiling for display.

## Accessibility

The results panel is an `aria-live="polite"` region - results update as you
type with no submit action, so without it the recalculation is silent to
screen reader users. The input has a real label association, `aria-invalid`,
and `aria-describedby` linking it to its error text. Focus states are
visible, transitions respect `prefers-reduced-motion`, and text colors pass
4.5:1 contrast.

## Scoped out on purpose

- **Currency selection.** The brief and wireframe fix BTC and ETH, so no
  picker. Adding currencies later would be easy, though: new entries go in
  the supported list in `assets.js`, and the rest of the app already
  handles any number of assets.
- **An adjustable split.** The brief states 70/30. I'd
  improve it with a range input bound to BTC's percent, ETH computed as
  the remainder.
- **Tests.** Omitted per the brief, but the math lives in pure functions
  (`allocate`, `parseAmount`, `validateAmount`) specifically so unit
  testing them would be easy.

## Known limitations

Rapid refresh clicks can race two fetches (last write wins). Locale is
fixed to en-US for a USD calculator.
