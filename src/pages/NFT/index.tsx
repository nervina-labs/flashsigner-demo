import React from 'react'
import { useQuery } from 'react-query'
import axios from 'axios'
import { useAccount, useChainType } from '../../hooks/useAccount'
import { MainContainer } from '../../components/Container'
import { Spinner, Text, VStack, Image, Stack } from '@chakra-ui/react'
import { NFTResponse, NFTToken, TransactionStatus } from '../../models/nft'
import { useNavigate } from 'react-router-dom'
import { RoutePath } from '../../routes/path'
import { stagingURL, mainnetURL } from '../../const'

export const NFT: React.FC = () => {
  const [ chainType ] = useChainType()
  const { account } = useAccount()
  const { data, isLoading } = useQuery(['nft', chainType], async () => {
    const { data } = await axios.get<NFTResponse>(`${chainType === 'mainnet' ? mainnetURL : stagingURL}/holder_tokens/${account.address}`, {
      params: {
        page: 1,
        limit: 100,
        exclude_banned: true,
      }
    })
    return data
  })
  const navi = useNavigate()
  const onTransfer = (token: NFTToken) => {
    if (token.tx_state === TransactionStatus.Pending) {
      alert('Please wait for the transaction to be committed')
      return
    }
    navi(`${RoutePath.Transfer}/${token.token_uuid}`)
  }
  return (
    <MainContainer>
      {isLoading ? <Spinner /> : <VStack spacing="2em">
        {data?.token_list.length === 0 ? <Text>No data</Text>  : data?.token_list?.map(item => {
          return (
            <Stack
              direction="column"
              border="1px solid #eee"
              borderRadius="20px"
              padding="20px"
              cursor="pointer"
              onClick={() => onTransfer(item)}
              key={item.class_uuid}
            >
              <Image src={item.class_bg_image_url} borderRadius="20px" />
              <Text>{item.class_name}</Text>
            </Stack>
          )
        })}
      </VStack>}
    </MainContainer>
  )
}
