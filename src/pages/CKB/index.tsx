import { VStack, Textarea, Button, Input } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MainContainer } from '../../components/Container'
import { RoutePath } from '../../routes/path'


export const CKB: React.FC = () => {
  const navi = useNavigate()
  const [toAddress, setToAddress] = useState('')
  const [value, setVal] = useState('')

  const onSubmit = () => {
    // create transaction
    // get user login state
    // get address / value
    // find cell
    // check cell value
    // build transaction object
      // get cell index tx_hash
      // dep_cells
      // flashsigner sign message
      // witness sign
    // trigger ckb sdk transction event
    // get callback
  }


  return (
    <MainContainer>
      <VStack spacing="5vh">
        <Textarea
          placeholder="Transfer address"
          onChange={e => setToAddress(e.target.value)}
        />
        <Input
          type='number'
          placeholder='Transfer value'
          onChange={ e => setVal(e.target.value)}
        />
        <Button isFullWidth onClick={onSubmit} isDisabled={value === '' || toAddress === ''} colorScheme="blue">
          Confirm
        </Button>
        <Button isFullWidth onClick={() => navi(RoutePath.Home)}>
          Go Home
        </Button>
      </VStack>
    </MainContainer>
  )
}
