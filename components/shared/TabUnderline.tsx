type Values = string | number

interface TabUnderlineProps<T extends Values> {
  activeValue: string
  onChange: (x: T) => void
  values: T[]
  names?: Array<string>
  small?: boolean
  fillWidth?: boolean
}

const TabUnderline = <T extends Values>({
  activeValue,
  values,
  names,
  onChange,
  small,
  fillWidth = true,
}: TabUnderlineProps<T>) => {
  return (
    <div className={`relative mb-3 border-b border-th-bkg-3 pb-1 font-bold`}>
      <div
        className={`absolute bottom-[-1px] left-0 h-1 bg-th-active`}
        style={{
          maxWidth: !fillWidth ? '176px' : '',
          transform: `translateX(${
            values.findIndex((v) => v === activeValue) * 100
          }%)`,
          width: `${100 / values.length}%`,
        }}
      />
      <nav className="-mb-px flex" aria-label="Tabs">
        {values.map((value, i) => (
          <button
            onClick={() => onChange(value)}
            className={`relative flex h-10 w-1/2 ${
              fillWidth ? '' : 'max-w-[176px]'
            }
            cursor-pointer items-center justify-center whitespace-nowrap rounded pb-2 focus-visible:text-th-fgd-2 md:h-auto md:rounded-none md:hover:opacity-100 ${
              small ? 'text-sm' : 'text-lg lg:text-xl'
            }
            ${
              activeValue === value
                ? activeValue === 'buy'
                  ? 'text-th-up'
                  : activeValue === 'sell'
                  ? 'text-th-down'
                  : 'text-th-active'
                : 'text-th-fgd-4 md:hover:text-th-fgd-3'
            }
          `}
            key={`${value}` + i}
          >
            <span className="relative">
              {names ? names[i] : value}
              {value === 'trade:trigger-order' ? (
                <span className="absolute -right-5 -top-3 ml-2 rounded bg-th-active px-1 py-0.5 text-xxs font-bold uppercase leading-none text-th-bkg-1">
                  beta
                </span>
              ) : null}
            </span>
          </button>
        ))}
      </nav>
    </div>
  )
}

export default TabUnderline