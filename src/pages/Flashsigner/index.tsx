import React, { useEffect } from 'react'
import { getResultFromURL } from '@nervina-labs/flashsigner'
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
      onSignTransaction(res) {
        navigate(RoutePath.SignTransaction, {
          replace: true,
          state: {
            tx: res.transaction,
          }
        })
      },
      onSignRawMessage(res) {
        navigate(RoutePath.SignMessage, {
          replace: true,
          state: {
            message: res.message,
            signature: res.signature
          }
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
      },
      onError(err) {
        alert(err)
        navigate(RoutePath.Home)
      }
    })
  }, [])

  return null
}
