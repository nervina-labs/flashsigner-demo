import { VStack, Textarea, Button } from '@chakra-ui/react'
import { signMessageWithRedirect, signTransactionWithRedirect } from 'flashsigner-sdk'
import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { MainContainer } from '../../components/Container'
import { SignMessageState } from '../../models/nft'
import { RoutePath } from '../../routes/path'

export const SignTransaction: React.FC = () => {
  const location =  useLocation()
  const state = location.state as SignMessageState ?? {}
  const [value, setVal] = useState(state?.message ?? '')

  const sign = () => {
    signTransactionWithRedirect(`${window.location.origin}${RoutePath.Flashsigner}`, {
      tx: JSON.parse(value),
    })
  }
  const navi = useNavigate()

  return (
    <MainContainer>
      <VStack spacing="5vh">
        <Textarea
          placeholder="Transaction to sign"
          value={value}
          onChange={e => setVal(e.target.value)}
        />
        <Textarea
          placeholder="Signed Transaction"
          isReadOnly
          value={state?.signature ?? ''}
        />
        <Button isFullWidth onClick={sign} isDisabled={value === ''} colorScheme="blue">
          Sign Transaction
        </Button>
        <Button isFullWidth onClick={() => navi(RoutePath.Home)}>
          Go Home
        </Button>
      </VStack>
    </MainContainer>
  )
}
