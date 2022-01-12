import { VStack, Textarea, Button } from '@chakra-ui/react'
import { signMessageWithRedirect } from '@nervina-labs/flashsigner'
import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { MainContainer } from '../../components/Container'
import { SignMessageState } from '../../models/nft'
import { RoutePath } from '../../routes/path'

export const SignMessage: React.FC = () => {
  const location =  useLocation()
  const state = location.state as SignMessageState ?? {}
  const [value, setVal] = useState(state?.message ?? '')

  const sign = () => {
    signMessageWithRedirect(`${window.location.origin}${RoutePath.Flashsigner}`, {
      message: value,
      isRaw: true,
    })
  }
  const navi = useNavigate()

  return (
    <MainContainer>
      <VStack spacing="5vh">
        <Textarea
          placeholder="Message to sign"
          value={value}
          onChange={e => setVal(e.target.value)}
        />
        <Textarea
          placeholder="signature"
          isReadOnly
          value={state?.signature ?? ''}
        />
        <Button isFullWidth onClick={sign} isDisabled={value === ''} colorScheme="blue">
          Sign
        </Button>
        <Button isFullWidth onClick={() => navi(RoutePath.Home)}>
          Go Home
        </Button>
      </VStack>
    </MainContainer>
  )
}
