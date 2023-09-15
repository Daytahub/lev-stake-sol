import { useCallback, useEffect, useState } from 'react'
import {
  ArrowLeftIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/20/solid'
import { useWallet } from '@solana/wallet-adapter-react'
import ConnectedMenu from './wallet/ConnectedMenu'
import ConnectWalletButton from './wallet/ConnectWalletButton'
import { useRouter } from 'next/router'
// import SolanaTps from './SolanaTps'
import useOnlineStatus from 'hooks/useOnlineStatus'
import mangoStore from '@store/mangoStore'

const set = mangoStore.getState().set

const TopBar = () => {
  const { connected } = useWallet()
  const themeData = mangoStore((s) => s.themeData)

  const [copied, setCopied] = useState('')
  const isOnline = useOnlineStatus()

  const router = useRouter()
  const { query } = router

  const handleShowSetup = useCallback(() => {
    set((s) => {
      s.showUserSetup = true
    })
  }, [])

  useEffect(() => {
    setTimeout(() => setCopied(''), 2000)
  }, [copied])

  return (
    <div
      className={`flex h-16 items-center justify-between`}
      style={{ backgroundImage: `url(${themeData.topTilePath})` }}
    >
      <div className="flex w-full items-center justify-between md:space-x-4">
        <span className="mb-0 flex items-center">
          {query.token || query.market ? (
            <button
              className="mr-4 flex h-16 w-16 items-center justify-center border-r border-th-bkg-3 focus-visible:bg-th-bkg-3 md:hover:bg-th-bkg-2"
              onClick={() => router.back()}
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
          ) : null}
          <div className="flex h-[63px] w-16 items-center justify-center bg-th-bkg-1 md:hidden">
            <img
              className="h-9 w-9 flex-shrink-0"
              src={themeData.logoPath}
              alt="logo"
            />
          </div>
        </span>
        {!isOnline ? (
          <div className="absolute left-1/2 top-3 z-10 flex h-10 w-max -translate-x-1/2 items-center rounded-full bg-th-down px-4 py-2 md:top-8">
            <ExclamationTriangleIcon className="h-5 w-5 flex-shrink-0 text-th-fgd-1" />
            <p className="ml-2 text-th-fgd-1">
              Your connection appears to be offline
            </p>
          </div>
        ) : null}
        <div className="flex items-center">
          {connected ? (
            <div className="flex h-[63px] items-center rounded-full bg-th-bkg-1">
              <ConnectedMenu />
            </div>
          ) : (
            <ConnectWalletButton handleShowSetup={handleShowSetup} />
          )}
        </div>
      </div>
    </div>
  )
}

export default TopBar