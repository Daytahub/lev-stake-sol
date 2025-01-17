import Image from 'next/image'
import { formatTokenSymbol } from 'utils/tokens'
import useBankRates from 'hooks/useBankRates'
import useLeverageMax from 'hooks/useLeverageMax'
import mangoStore from '@store/mangoStore'
import SheenLoader from './shared/SheenLoader'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

const TokenButton = ({
  onClick,
  tokenName,
}: {
  tokenName: string
  onClick: () => void
}) => {
  const leverage = useLeverageMax(tokenName)
  const groupLoaded = mangoStore((s) => s.groupLoaded)

  const { stakeBankDepositRate, financialMetrics } = useBankRates(
    tokenName,
    leverage,
  )

  const { financialMetrics: estimatedNetAPYFor1xLev } = useBankRates(
    tokenName,
    1,
  )

  const APY_Daily_Compound =
    Math.pow(1 + Number(stakeBankDepositRate) / 365, 365) - 1
  const UiRate =
    tokenName === 'USDC'
      ? APY_Daily_Compound * 100
      : Math.max(estimatedNetAPYFor1xLev.APY, financialMetrics.APY)

  return (
    <button
      className={`inner-shadow-bottom-sm default-transition w-full rounded-xl border border-th-bkg-3 bg-th-bkg-1 p-3 text-th-fgd-1 focus:outline-none focus-visible:border-th-fgd-4 md:hover:bg-th-bkg-2 md:hover:focus-visible:border-th-fgd-4`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className={`inner-shadow-bottom-sm flex h-12 w-12 items-center justify-center rounded-full border border-th-bkg-2 bg-gradient-to-b from-th-bkg-1 to-th-bkg-2`}
          >
            <Image
              src={`/icons/${tokenName.toLowerCase()}.svg`}
              width={24}
              height={24}
              alt="Select a token"
            />
          </div>
          <div className="text-left">
            <p className={`mb-0.5 text-th-fgd-1`}>
              {formatTokenSymbol(tokenName)}
            </p>
            <span className={`text-lg font-bold leading-none text-th-fgd-1`}>
              {!groupLoaded ? (
                <SheenLoader>
                  <div className={`h-5 w-10 bg-th-bkg-2`} />
                </SheenLoader>
              ) : !UiRate || isNaN(UiRate) ? (
                <span className="text-base font-normal text-th-fgd-4">
                  Rate Unavailable
                </span>
              ) : tokenName === 'USDC' ? (
                <>
                  {`${UiRate.toFixed(2)}%`}{' '}
                  <span className="text-sm font-normal text-th-fgd-4">APY</span>
                </>
              ) : (
                <>
                  {`${UiRate.toFixed(2)}%`}{' '}
                  <span className="text-sm font-normal text-th-fgd-4">
                    Max APY
                  </span>
                </>
              )}
            </span>
          </div>
        </div>
        <ChevronDownIcon className="h-6 w-6" />
      </div>
    </button>
  )
}

export default TokenButton
