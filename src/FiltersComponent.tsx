import './FiltersComponent.css'
import { CSSProperties, useEffect, useState } from 'react'
import { FixedSizeList as List, ListOnItemsRenderedProps } from 'react-window'

let selectedFilters = new Uint8Array(0)
let changes = new Uint8Array(0)
let commited = new Uint8Array(0)

let visibleItems: ListOnItemsRenderedProps = {
  overscanStartIndex: 0,
  overscanStopIndex: 0,
  visibleStartIndex: 0,
  visibleStopIndex: 0,
}

const setChange = (index: number, value: number) => {
  if (value === commited[index]) {
    changes[index] = 0
  } else {
    changes[index] = 1
  }
}

export default function FiltersComponent({ filters }: { filters: Uint8Array }) {
  const [dirty, setDirty] = useState(false)
  const [allOverride, setAllOverride] = useState(-1)

  useEffect(() => {
    selectedFilters = new Uint8Array(filters.length)
    selectedFilters.fill(0)
    changes = new Uint8Array(filters.length)
    changes.fill(0)

    for (let i = 0; i < filters.length; i++) {
      if (filters[i] === 1) {
        selectedFilters[i] = 1
      }
    }
    commited = new Uint8Array(selectedFilters)
    setDirty(!dirty)
  }, [filters.length])

  let allSelected = true
  for (let i = 0; i < selectedFilters.length; i++) {
    if (selectedFilters[i] === 0) {
      allSelected = false
      break
    }
  }
  let changesExist = false
  for (let i = 0; i < selectedFilters.length; i++) {
    if (changes[i] === 1) {
      changesExist = true
      break
    }
  }

  const onApply = () => {
    commited = new Uint8Array(selectedFilters)
    changes.fill(0)
    setDirty(!dirty)
    console.log('changes applied')
  }

  const onSelectAll = () => {
    const val = allSelected ? 0 : 1
    console.log('select all', val)

    console.log('visibleItems', visibleItems)
    for (
      let i = visibleItems.visibleStartIndex;
      i <= visibleItems.visibleStopIndex;
      i++
    ) {
      selectedFilters[i] = val
      setChange(i, val)
    }
    setAllOverride(val)

    setTimeout(() => {
      const n = Date.now()
      console.log('Background update of non visible start')
      for (let i = 0; i < selectedFilters.length; i++) {
        if (selectedFilters[i] === val) {
          continue
        }
        selectedFilters[i] = val
        setChange(i, val)
      }
      setAllOverride(-1)
      console.log('Background update of non visible end', Date.now() - n)
    }, 10)
  }

  const onClick = (index: number) => {
    if (index >= 0) {
      selectedFilters[index] = 1 - selectedFilters[index]
      setChange(index, selectedFilters[index])
      setDirty(!dirty)
    } else {
      onSelectAll()
    }
  }

  return (
    <div className="app-container">
      <h2>Apply Filters</h2>
      <List
        height={300}
        width={397}
        itemCount={filters.length + 1}
        itemSize={40}
        onItemsRendered={(props) => {
          console.log('onItemsRendered', props)
          visibleItems = props
        }}
      >
        {({ index, style }) =>
          index === 0 ? (
            <Filter
              style={style}
              id={'all'}
              checked={allOverride >= 0 ? !!allOverride : allSelected}
              label="Select All"
              index={-1}
              onChange={onClick}
            />
          ) : (
            <Filter
              style={style}
              key={`${filters[index - 1]}`}
              checked={selectedFilters[index - 1] === 1}
              id={`${filters[index - 1]}`}
              label={`name ${filters[index - 1]}`}
              index={index - 1}
              onChange={onClick}
            />
          )
        }
      </List>
      <button
        className="apply-button"
        disabled={!changesExist}
        onClick={() => onApply()}
      >
        Apply Filters
      </button>
    </div>
  )
}

const Filter = ({
  id,
  label = '',
  onChange,
  style,
  index,
  checked,
}: {
  id: string
  checked?: boolean
  label?: string
  onChange?: (index: number) => void
  index: number
  style: CSSProperties
}) => {
  const onClick = () => onChange?.(index)

  return (
    <div style={style}>
      <div className="filter" onClick={onClick} data-testid={`filter-${id}`}>
        <input type="checkbox" checked={checked} onChange={onClick} />
        <span>{label}</span>
      </div>
    </div>
  )
}
