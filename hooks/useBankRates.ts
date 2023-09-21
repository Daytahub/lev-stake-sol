import { useMemo } from 'react'
import useStakeRates from './useStakeRates'
import useMangoGroup from './useMangoGroup'
import mangoStore from '@store/mangoStore'

const set = mangoStore.getState().set

export default function useBankRates(selectedToken: string, leverage: number) {
  const { data: stakeRates } = useStakeRates()
  const { group } = useMangoGroup()

  const stakeBank = useMemo(() => {
    return group?.banksMapByName.get(selectedToken)?.[0]
  }, [selectedToken, group])

  const borrowBank = useMemo(() => {
    return group?.banksMapByName.get('SOL')?.[0]
  }, [group])

  const stakeBankDepositRate = useMemo(() => {
    return stakeBank ? stakeBank.getDepositRateUi() : 0
  }, [stakeBank])

  const borrowBankBorrowRate = useMemo(() => {
    return borrowBank ? borrowBank.getBorrowRateUi() : 0
  }, [borrowBank])

  const borrowBankStakeRate = useMemo(() => {
    return stakeRates ? stakeRates[selectedToken.toLowerCase()] * 100 : 0
  }, [stakeRates, selectedToken])

  const leveragedAPY = useMemo(() => {
    return borrowBankStakeRate ? borrowBankStakeRate * leverage : 0
  }, [borrowBankStakeRate, leverage])

  const estimatedNetAPY = useMemo(() => {
    return (
      borrowBankStakeRate * leverage - borrowBankBorrowRate * (leverage - 1)
    )
  }, [borrowBankStakeRate, leverage, borrowBankBorrowRate])

  const estimatedMaxAPY = useMemo(() => {
    set((s) => {
      s.estimatedMaxAPY.current =
        borrowBankStakeRate * 3 - borrowBankBorrowRate * 2
    })
  }, [borrowBankStakeRate, borrowBankBorrowRate])

  return {
    stakeBankDepositRate,
    borrowBankBorrowRate,
    borrowBankStakeRate,
    leveragedAPY,
    estimatedNetAPY,
    estimatedMaxAPY,
  }
}
