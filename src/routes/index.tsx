import { Config } from 'flashsigner-sdk'
import React, { Suspense, useEffect, useLayoutEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { useAccount, useChainType } from '../hooks/useAccount'
import { Flashsigner } from '../pages/Flashsigner'
import { Home } from '../pages/Home'
import { NFT } from '../pages/NFT'
import { Transfer } from '../pages/Transfer'
import { RoutePath } from './path'

export const Routers: React.FC = () => {
  const [chainType] = useChainType()
  useLayoutEffect(() => {
    // Normally, your application doesn't need to switch chainType.
    // So you only need to set the chainType when the application loads.
    if (chainType === 'mainnet') {
      Config.setChainType('mainnet')
    } else {
      Config.setChainType('testnet')
    }
  }, [chainType])
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route path={RoutePath.Home} element={<Home />} />
          <Route path={RoutePath.NFT} element={<NFT />} />
          <Route path={`${RoutePath.Transfer}/:uuid`} element={<Transfer />} />
          <Route path={RoutePath.Flashsigner} element={<Flashsigner />} />
        </Routes>
      </Suspense>
      <ConfirmDialog />
    </BrowserRouter>
  )
}
