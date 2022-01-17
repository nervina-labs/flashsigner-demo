import { VStack, Textarea, Button } from '@chakra-ui/react'
import { signMessageWithRedirect, signTransactionWithRedirect } from '@nervina-labs/flashsigner'
import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { MainContainer } from '../../components/Container'
import { SignMessageState } from '../../models/nft'
import { RoutePath } from '../../routes/path'

export const SignTransaction: React.FC = () => {
  const location =  useLocation()
  const state = location.state as any ?? {}
  const [value, setVal] = useState(state?.message ?? '')

  const sign = () => {
    try {
      signTransactionWithRedirect(`${window.location.origin}${RoutePath.Flashsigner}`, {
        tx: JSON.parse(value),
      })
    } catch (error) {
      alert('not a valid transaction, please enter a valid JSON transaction')
    }
  }
  const navi = useNavigate()

  return (
    <MainContainer>
      <VStack spacing="5vh">
        <Textarea
          placeholder="Transaction to sign"
          value={value}
          onChange={e => setVal(e.target.value)}
          size="lg"
          height="30vh"
        />
        <Textarea
          placeholder="Signed Transaction"
          isReadOnly
          value={state?.tx ? JSON.stringify(state?.tx, null, 4) : ''}
          size="lg"
          height="30vh"
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
