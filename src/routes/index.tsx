import { Config } from '@nervina-labs/flashsigner'
import React, { Suspense, useLayoutEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useChainType } from '../hooks/useAccount'
import { Flashsigner } from '../pages/Flashsigner'
import { Home } from '../pages/Home'
import { NFT } from '../pages/NFT'
import { SignMessage } from '../pages/SignMessage'
import { SignTransaction } from '../pages/SignTransaction'
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
          <Route path={RoutePath.SignMessage} element={<SignMessage />} />
          <Route path={RoutePath.SignTransaction} element={<SignTransaction />} />
          <Route path={`${RoutePath.Transfer}/:uuid`} element={<Transfer />} />
          <Route path={RoutePath.Flashsigner} element={<Flashsigner />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
