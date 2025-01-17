import useMangoGroup from 'hooks/useMangoGroup'
import { useMemo, useState } from 'react'
import { SHOW_INACTIVE_POSITIONS_KEY } from 'utils/constants'
import TokenLogo from './shared/TokenLogo'
import Button from './shared/Button'
import { formatTokenSymbol } from 'utils/tokens'
import mangoStore, { ActiveTab } from '@store/mangoStore'
import Switch from './forms/Switch'
import useLocalStorageState from 'hooks/useLocalStorageState'
import FormatNumericValue from './shared/FormatNumericValue'
import {
  Bank,
  MangoAccount,
  toUiDecimalsForQuote,
} from '@blockworks-foundation/mango-v4'
import useBankRates from 'hooks/useBankRates'
import usePositions from 'hooks/usePositions'
import { AdjustmentsHorizontalIcon } from '@heroicons/react/20/solid'
import EditLeverageModal from './modals/EditLeverageModal'
import Tooltip from './shared/Tooltip'
import { useWallet } from '@solana/wallet-adapter-react'

const set = mangoStore.getState().set

export type Position = {
  borrowBalance: number
  stakeBalance: number
  pnl: number
  bank: Bank
  acct: MangoAccount | undefined
}

const Positions = ({
  setActiveTab,
}: {
  setActiveTab: (tab: ActiveTab) => void
}) => {
  const [showInactivePositions, setShowInactivePositions] =
    useLocalStorageState(SHOW_INACTIVE_POSITIONS_KEY, true)
  const { positions, jlpBorrowBank, lstBorrowBank } = usePositions(
    showInactivePositions,
  )

  const numberOfPositions = useMemo(() => {
    if (!positions.length) return 0
    return positions.filter((pos) => pos.stakeBalance > 0).length
  }, [positions])

  return (
    <>
      <div className="mb-2 flex items-center justify-between rounded-lg border-2 border-th-fgd-1 bg-th-bkg-1 px-6 py-3.5">
        <p className="font-medium">{`You have ${numberOfPositions} active position${
          numberOfPositions !== 1 ? 's' : ''
        }`}</p>
        <Switch
          checked={showInactivePositions}
          onChange={(checked) => setShowInactivePositions(checked)}
        >
          Show Inactive
        </Switch>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {positions.length ? (
          positions.map((position) => {
            const { bank } = position
            const isUsdcBorrow = bank.name === 'JLP' || bank.name === 'USDC'
            return position.bank ? (
              <PositionItem
                key={bank.name}
                position={position}
                setActiveTab={setActiveTab}
                borrowBank={isUsdcBorrow ? jlpBorrowBank : lstBorrowBank}
              />
            ) : null
          })
        ) : (
          <div className="flex justify-center rounded-2xl border-2 border-th-fgd-1 bg-th-bkg-1 p-6">
            <span>Nothing to see here...</span>
          </div>
        )}
      </div>
    </>
  )
}

const PositionItem = ({
  position,
  setActiveTab,
  borrowBank,
}: {
  position: Position
  setActiveTab: (v: ActiveTab) => void
  borrowBank: Bank | undefined
}) => {
  const { connected } = useWallet()
  const { jlpGroup, lstGroup } = useMangoGroup()
  const { stakeBalance, bank, pnl, acct } = position

  const handleAddOrManagePosition = (token: string) => {
    setActiveTab('Boost!')
    set((state) => {
      state.selectedToken = token
    })
  }
  const [showEditLeverageModal, setShowEditLeverageModal] = useState(false)

  const leverage = useMemo(() => {
    if (!acct || !bank) return 1
    const isJlpGroup = bank.name === 'JLP' || bank.name === 'USDC'
    const group = isJlpGroup ? jlpGroup : lstGroup
    if (!group) return 1
    const accountValue = toUiDecimalsForQuote(acct.getEquity(group).toNumber())

    const assetsValue = toUiDecimalsForQuote(
      acct.getAssetsValue(group).toNumber(),
    )

    if (isNaN(assetsValue / accountValue)) {
      return 0
    } else {
      return Math.abs(1 - assetsValue / accountValue) + 1
    }
  }, [acct, bank, jlpGroup, lstGroup])

  const liqRatio = useMemo(() => {
    const price = Number(bank?.uiPrice)
    const borrowMaintLiabWeight = Number(borrowBank?.maintLiabWeight)
    const stakeMaintAssetWeight = Number(bank?.maintAssetWeight)
    const loanOriginationFee = Number(borrowBank?.loanOriginationFeeRate)
    const liqPrice =
      price *
      ((borrowMaintLiabWeight * (1 + loanOriginationFee)) /
        stakeMaintAssetWeight) *
      (1 - 1 / leverage)
    return liqPrice.toFixed(3)
  }, [bank, borrowBank, leverage])

  const { financialMetrics, stakeBankDepositRate, borrowBankBorrowRate } =
    useBankRates(bank.name, leverage)

  const APY_Daily_Compound =
    Math.pow(1 + Number(stakeBankDepositRate) / 365, 365) - 1
  const uiRate =
    bank.name == 'USDC' ? APY_Daily_Compound * 100 : financialMetrics.APY

  return (
    <div className="rounded-2xl border-2 border-th-fgd-1 bg-th-bkg-1 p-6">
      <div className="mb-4 flex flex-col border-b border-th-bkg-3 pb-4 md:flex-row md:items-center md:justify-between">
        <div className="mb-4 flex items-center space-x-3 md:mb-0">
          <div
            className={`inner-shadow-bottom-sm flex h-12 w-12 items-center justify-center rounded-full border border-th-bkg-2 bg-gradient-to-b from-th-bkg-1 to-th-bkg-2`}
          >
            <TokenLogo bank={bank} size={28} />
          </div>
          <div>
            <h3>{formatTokenSymbol(bank.name)}</h3>
            <p>${bank.uiPrice.toFixed(2)}</p>
          </div>
        </div>
        <Button onClick={() => handleAddOrManagePosition(bank.name)}>
          <p className="mb-1 text-base tracking-wider text-th-bkg-1">
            {stakeBalance ? 'Add/Remove' : `Boost! ${bank.name}`}
          </p>
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-1 text-th-fgd-4">Position Size</p>
          <span className="text-xl font-bold text-th-fgd-1">
            <FormatNumericValue
              value={stakeBalance * (bank.name != 'USDC' ? bank?.uiPrice : 1)}
              decimals={2}
            />{' '}
            {'USDC'}
          </span>
          {bank.name !== 'USDC' ? (
            <p className="text-th-fgd-4">
              <FormatNumericValue
                roundUp={true}
                value={stakeBalance}
                decimals={3}
              />{' '}
              {formatTokenSymbol(bank.name)}
            </p>
          ) : null}
        </div>
        <div>
          <p className="mb-1 text-th-fgd-4">Est. APY</p>
          {bank.name !== 'USDC' ? (
            <div className="w-max">
              <Tooltip
                content={
                  <>
                    <div className="space-y-2 md:px-3">
                      <div className="flex justify-between gap-6">
                        <p className="text-th-fgd-4">
                          {formatTokenSymbol(bank.name)} Yield APY
                        </p>
                        <span className="font-bold text-th-success">
                          {financialMetrics.collectedReturnsAPY > 0.01
                            ? '+'
                            : ''}
                          <FormatNumericValue
                            value={financialMetrics.collectedReturnsAPY}
                            decimals={2}
                          />
                          %
                        </span>
                      </div>
                      <div className="flex justify-between gap-6">
                        <p className="text-th-fgd-4">
                          {formatTokenSymbol(bank.name)} Collateral Fee APY
                        </p>
                        <span
                          className={`font-bold ${
                            financialMetrics?.collateralFeeAPY > 0.01
                              ? 'text-th-error'
                              : 'text-th-bkg-4'
                          }`}
                        >
                          {financialMetrics?.collateralFeeAPY > 0.01 ? '-' : ''}
                          <FormatNumericValue
                            value={financialMetrics?.collateralFeeAPY?.toString()}
                            decimals={2}
                          />
                          %
                        </span>
                      </div>
                      {borrowBank ? (
                        <>
                          <div className="flex justify-between gap-6">
                            <p className="text-th-fgd-4">{`${borrowBank?.name} Borrow APY`}</p>
                            <span
                              className={`font-bold ${
                                borrowBankBorrowRate > 0.01
                                  ? 'text-th-error'
                                  : 'text-th-bkg-4'
                              }`}
                            >
                              -
                              <FormatNumericValue
                                value={financialMetrics.borrowsAPY}
                                decimals={2}
                              />
                              %
                            </span>
                          </div>
                        </>
                      ) : null}
                    </div>
                  </>
                }
              >
                <span className="tooltip-underline text-xl font-bold text-th-fgd-1">
                  <FormatNumericValue value={Number(uiRate)} decimals={2} />%
                </span>
              </Tooltip>
            </div>
          ) : (
            <>
              <span className="text-xl font-bold text-th-fgd-1">
                <FormatNumericValue value={Number(uiRate)} decimals={2} />%
              </span>
            </>
          )}
        </div>
        <div>
          <p className="mb-1 text-th-fgd-4">Total Earned</p>
          <span
            className={`text-xl font-bold ${
              !stakeBalance
                ? 'text-th-fgd-4'
                : pnl >= 0
                ? 'text-th-success'
                : 'text-th-error'
            }`}
          >
            {stakeBalance || pnl ? (
              <FormatNumericValue value={pnl} decimals={2} isUsd />
            ) : (
              '–'
            )}
          </span>
        </div>
        {position.bank.name == 'USDC' ? null : (
          <>
            <div>
              <p className="mb-1 text-th-fgd-4">Leverage</p>
              <div className="flex items-center">
                <span className="mr-3 text-xl font-bold text-th-fgd-1">
                  {connected && stakeBalance && leverage
                    ? `${leverage.toFixed(2)}x`
                    : '–'}
                </span>
                {connected && stakeBalance ? (
                  <button
                    onClick={async () => {
                      await set((state) => {
                        state.selectedToken = bank.name
                      })
                      setShowEditLeverageModal(!showEditLeverageModal)
                    }}
                    className="default-transition flex items-center rounded-md border-b-2 border-th-bkg-4 bg-th-bkg-2 px-2.5 py-1 text-th-fgd-1 md:hover:bg-th-bkg-3"
                  >
                    <AdjustmentsHorizontalIcon className="mr-1.5 h-4 w-4" />
                    <span className="font-bold">Edit</span>
                  </button>
                ) : null}
              </div>
            </div>
            <div>
              <p className="mb-1 text-th-fgd-4">Est. Liquidation Price</p>
              <div className="flex flex-wrap items-end">
                <span className="mr-2 whitespace-nowrap text-xl font-bold text-th-fgd-1">
                  ${liqRatio}
                </span>
              </div>
              {/* {liqPriceChangePercentage ? (
                <Tooltip content="Estimated price change required for liquidation.">
                  <p className="tooltip-underline mb-0.5 text-th-fgd-4">
                    {liqPriceChangePercentage}%
                  </p>
                </Tooltip>
              ) : null} */}
            </div>
          </>
        )}
      </div>
      {showEditLeverageModal ? (
        <EditLeverageModal
          token={bank.name}
          isOpen={showEditLeverageModal}
          onClose={() => {
            setShowEditLeverageModal(false)
          }}
        />
      ) : null}
    </div>
  )
}

export default Positions
