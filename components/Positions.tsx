import useMangoGroup from 'hooks/useMangoGroup'
import { useMemo } from 'react'
import { SHOW_INACTIVE_POSITIONS_KEY, STAKEABLE_TOKENS } from 'utils/constants'
import TokenLogo from './shared/TokenLogo'
import Button from './shared/Button'
import { formatTokenSymbol } from 'utils/tokens'
import mangoStore from '@store/mangoStore'
import Switch from './forms/Switch'
import useLocalStorageState from 'hooks/useLocalStorageState'

const set = mangoStore.getState().set

const Positions = ({
  setActiveTab,
}: {
  setActiveTab: (tab: string) => void
}) => {
  const { group } = useMangoGroup()
  const [showInactivePositions, setShowInactivePositions] =
    useLocalStorageState(SHOW_INACTIVE_POSITIONS_KEY, true)

  const banks = useMemo(() => {
    if (!group) return []
    const positionBanks = []
    for (const token of STAKEABLE_TOKENS) {
      const bank = group.banksMapByName.get(token)?.[0]
      positionBanks.push(bank)
    }
    return positionBanks
  }, [group])

  const positions = useMemo(() => {
    if (!banks.length) return []
    const positions = []
    for (const bank of banks) {
      let balance = 0
      if (bank?.name === 'JitoSOL') {
        balance = 100
      }
      positions.push({ balance, bank })
    }
    const sortedPositions = positions.sort((a, b) => b.balance - a.balance)
    return showInactivePositions
      ? sortedPositions
      : sortedPositions.filter((pos) => pos.balance > 0)
  }, [banks, showInactivePositions])

  const numberOfPositions = useMemo(() => {
    if (!positions.length) return 0
    return positions.filter((pos) => pos.balance > 0).length
  }, [positions])

  const handleAddOrManagePosition = (token: string) => {
    setActiveTab('Stake')
    set((state) => {
      state.selectedToken = token
    })
  }

  return positions.length ? (
    <div className="space-y-3">
      <div className="mb-4 flex items-center justify-between">
        <p>{`You have ${numberOfPositions} active position${
          numberOfPositions > 1 ? 's' : ''
        }`}</p>
        <Switch
          checked={showInactivePositions}
          onChange={(checked) => setShowInactivePositions(checked)}
        >
          Show Inactive
        </Switch>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {positions.map((position, i) => {
          const { balance, bank } = position
          return bank ? (
            <div
              className="rounded-2xl border border-th-fgd-1 p-6"
              key={i + balance}
            >
              <div className="mb-6 flex flex-col border-b border-th-bkg-4 pb-6 md:flex-row md:items-center md:justify-between">
                <div className="mb-4 flex items-center space-x-3 md:mb-0">
                  <TokenLogo bank={bank} size={40} />
                  <div>
                    <h3>{formatTokenSymbol(bank.name)}</h3>
                    <span
                      className={`text-sm ${
                        balance ? 'text-th-fgd-1' : 'text-th-fgd-4'
                      }`}
                    >
                      {balance ? 'Opened 2 weeks ago' : 'No Position'}
                    </span>
                  </div>
                </div>
                <Button
                  onClick={() => handleAddOrManagePosition(bank.name)}
                  secondary
                >
                  {balance ? 'Manage' : 'Add Position'}
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="mb-1">Position Size</p>
                  <span className="text-xl font-bold">
                    {balance} {formatTokenSymbol(bank.name)}
                  </span>
                </div>
                <div>
                  <p className="mb-1">Est. APR</p>
                  <span className="text-xl font-bold">14.89%</span>
                </div>
                <div>
                  <p className="mb-1">Leverage</p>
                  <span className="text-xl font-bold">
                    {balance ? '3x' : '0x'}
                  </span>
                </div>
                <div>
                  <p className="mb-1">Earned</p>
                  <span className="text-xl font-bold">
                    {balance ? '3.321 SOL' : '0 SOL'}
                  </span>
                </div>
                <div>
                  <p className="mb-1">Liquidation Price</p>
                  <span className="whitespace-nowrap text-xl font-bold">
                    {balance ? '1.234' : '0'}{' '}
                    {`${formatTokenSymbol(bank.name)}/SOL`}
                  </span>
                </div>
              </div>
            </div>
          ) : null
        })}
      </div>
    </div>
  ) : null
}

export default Positions