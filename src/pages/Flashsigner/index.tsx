import React, { useEffect } from 'react'
import { getResultFromURL } from 'flashsigner-sdk'
import { useAccount } from '../../hooks/useAccount'
import { useNavigate } from 'react-router-dom'
import { RoutePath } from '../../routes/path'

export interface RouteState {
  uuid: string
  toAddress: string
}

export const Flashsigner: React.FC = () => {
  const { setAccount } = useAccount()
  const navigate = useNavigate()
  useEffect(() => {
    getResultFromURL<RouteState>({
      onLogin(res) {
        const { address, pubkey, message, signature }  = res
        setAccount({
          address,
          auth: {
            pubkey,
            signature,
            message,
          }
        })
        navigate(RoutePath.Home, {
          replace: true,
        })
      },
      onTransferMnft(res) {
        const { uuid, toAddress } = res.extra!
        navigate(`${RoutePath.Transfer}/${uuid}`, {
          state: {
            tx: res.transaction,
            toAddress,
          },
          replace: true,
        })
      }
    })
  }, [])

  return null
}
