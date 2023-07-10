export type FilterType = { id: string; displayName: string; checked: boolean }

const booleanRandom = (index: number) => {
  if (index % 7 === 0 || index % 3 === 0) {
    return 1
  }
  return 0
}

export const getFilters: (
  amount?: number,
  allSelected?: boolean
) => Uint8Array = (amount = 100, allSelected = false) => {
  const checked = new Uint8Array(amount)
  for (let i = 0; i < amount; i++) {
    checked[i] = allSelected ? 1 : booleanRandom(i)
  }
  return checked
}
