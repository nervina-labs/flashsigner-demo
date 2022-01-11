import { Button, Select, Stack, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { MainContainer } from '../../components/Container'
import { useAccount, useChainType } from '../../hooks/useAccount'
import { Config, loginWithRedirect } from 'flashsigner-sdk'
import { RoutePath } from '../../routes/path'
import { ArrowBackIcon, ArrowForwardIcon, StarIcon } from '@chakra-ui/icons'
import { useNavigate } from 'react-router-dom'

const mainnetURL = 'https://flashsigner.com'
const testnetURL = 'https://staging.flashsigner.work'

export const Home: React.FC = () => {
  const { isLoggedIn, logout, account } = useAccount()
  const [ chainType, setChainType ] = useChainType()
  const [network, setNetwork] = useState(chainType === 'mainnet' ? mainnetURL : testnetURL)
  const login = () => {
    loginWithRedirect(`${location.origin}${RoutePath.Flashsigner}`, {
      name: 'Flashsigner Demo',
      logo: `${location.origin}/favicon.svg`,
    })
    return
  }
  const navi = useNavigate()

  const networkOnChange = (v: string) => {
    logout()
    if (v === mainnetURL) {
      setChainType('mainnet')
    } else {
      setChainType('testnet')
    }
    setNetwork(v)
    Config.setFlashsignerURL(v)
  }

  const transfer = () => {
    if (!isLoggedIn) {
      alert('Please login first')
      return
    }
    navi(RoutePath.NFT)
  }

  const signMessage = () => {
    if (!isLoggedIn) {
      alert('Please login first')
      return
    }
    navi(RoutePath.SignMessage)
  }

  const signTx = () => {
    if (!isLoggedIn) {
      alert('Please login first')
      return
    }
    navi(RoutePath.SignTransaction)
  }

  return (
    <MainContainer>
      <Stack spacing="2em" direction="column">
        <Text>Chain Type: </Text>
        <Select value={network} onChange={e => networkOnChange(e.target.value)}>
          <option value={mainnetURL}>Mainnet: {mainnetURL.slice(8)}</option>
          <option value={testnetURL}>Testnet: {testnetURL.slice(8)}</option>
        </Select>
        <Text mb='8px' mt="8px">Login info: </Text>
        {isLoggedIn ?
          <code>
            {JSON.stringify(account.address, null, 2)}
          </code>
        : null}
        <Button leftIcon={<ArrowForwardIcon />} isFullWidth onClick={login} colorScheme="blue">
          Login
        </Button>
        <Button leftIcon={<ArrowBackIcon />} isFullWidth onClick={() => logout()}>
          Logout
        </Button>
        <Button leftIcon={<StarIcon />} isFullWidth colorScheme="cyan" onClick={transfer}>
          Transfer NFT
        </Button>
        <Button isFullWidth colorScheme="pink" onClick={signMessage}>
          Sign raw message
        </Button>
        <Button isFullWidth colorScheme="pink" onClick={signTx}>
          Sign raw transaction
        </Button>
      </Stack>
    </MainContainer>
  )
}
