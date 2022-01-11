import { VStack, Textarea, Button } from '@chakra-ui/react'
import axios from 'axios'
import { transferMnftWithRedirect } from 'flashsigner-sdk'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { MainContainer } from '../../components/Container'
import { useAccount, useChainType } from '../../hooks/useAccount'
import { TransferState } from '../../models/nft'
import { RoutePath } from '../../routes/path'
import { stagingURL, mainnetURL } from '../../const'
import { useQuery } from 'react-query'

export const Transfer: React.FC = () => {
  const location =  useLocation()
  const state = location.state as TransferState ?? {}
  const [value, setVal] = useState(state?.toAddress ?? '')
  const [chainType] = useChainType()
  const { uuid } = useParams<{ uuid: string }>()
  const { account } = useAccount()
  const { data: token, isLoading } = useQuery(['NFT-detail', uuid, chainType, account.address], async () => {
    const { data } = await axios.get(`${chainType === 'mainnet' ? mainnetURL : stagingURL}/tokens/${uuid}`, {
      headers: {
        auth: JSON.stringify({
          message: account.auth.message,
          signature: account.auth.signature,
          address: account.address,
        })
      }
    })
    return data
  })
  const transfer = () => {
    transferMnftWithRedirect(`${window.location.origin}${RoutePath.Flashsigner}`, {
      issuerId: token.n_issuer_id!,
      tokenId: `${token.n_token_id!}`,
      classId: token.class_id,
      fromAddress: account.address,
      toAddress: value,
      extra: {
        uuid,
        toAddress: value,
      }
    })
  }
  const navi = useNavigate()
  useEffect(() => {
    if (state.tx) {
      const data = {
        signed_tx: JSON.stringify(state.tx),
        token_uuid: uuid,
        from_address: account.address,
        to_address: state.toAddress,
      }
      axios.post(`${chainType === 'mainnet' ? mainnetURL : stagingURL}/token_ckb_transactions`, data).then((res) => {
        alert('Transfer success. tx hash: ' + res.data.tx_hash)
        navi(RoutePath.Home)
      })
    }
  }, [])

  return (
    <MainContainer>
      <VStack spacing="5vh">
        <Textarea
          placeholder="To address"
          value={value}
          onChange={e => setVal(e.target.value)}
        />
        <Button isLoading={isLoading} isFullWidth onClick={transfer} isDisabled={value === '' || value === account.address}>
          Transfer
        </Button>
      </VStack>
    </MainContainer>
  )
}
