import { VStack, Textarea, Button, Input, Box } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { MainContainer } from '../../components/Container'
import { RoutePath } from '../../routes/path'
import { useAccount } from '../../hooks/useAccount'

import CKBCore from '@nervosnetwork/ckb-sdk-core'
import { Indexer, CellCollector } from "@ckb-lumos/ckb-indexer"
import { generateFlashsignerLockScript } from '@nervina-labs/flashsigner'

const nodeUri = "https://testnet.ckb.dev/rpc"
const indexUri = "https://testnet.ckb.dev/indexer"

const testMoney = {
  mainet: 'ckb1qyqy84gfm9ljvqr69p0njfqullx5zy2hr9kqjynwlg',
  testnet: 'ckt1qyqy84gfm9ljvqr69p0njfqullx5zy2hr9kq0pd3n5',
  lock_arg: '0x43d509d97f26007a285f39241cffcd411157196c',
  private_key: '0xdd50cac37ec6dd12539a968c1a2cbedda75bd8724f7bcad486548eaabb87fc8b'
}

const indexer = new Indexer(indexUri, nodeUri)
indexer.startForever()


interface Lock {
  args: string;
  codeHash: string;
  hashType: CKBComponents.ScriptHashType;
}
interface Transfer {
  lock: Lock,
  fromAddress: string,
  toAddress: string,
  amount: number
}

interface CellRef {
  current?: RawTransactionParams.Cell[]
}

export const CKB: React.FC = () => {
  const location = useLocation()
  console.log(location.state)
  const state = location.state as any ?? {}
  const navi = useNavigate()
  const { account } = useAccount()
  const [toAddress, setToAddress] = useState(state?.toAddress ?? '')
  const [amount, setVal] = useState(state?.amount ?? '')
  const [balance, setBalance] = useState(0)
  const unspentCellsRef:CellRef = useRef()

  // const transfer = async ({ lock, fromAddress, toAddress, amount }: Transfer) => {

  //   const rawTransaction = ckb.generateRawTransaction({
  //     fromAddress: fromAddress,
  //     toAddress: toAddress,
  //     capacity: amount,
  //     fee: BigInt(100000),
  //     safeMode: true,
  //     cells: unspentCells,
  //     deps: ckb.config.secp256k1Dep,
  //   })

  //   const signedTx = ckb.signTransaction(testMoney.private_key)(rawTransaction)
  //   /**
  //    * to see the signed transaction
  //    */
  //   console.log(JSON.stringify(signedTx, null, 2))

  //   // const realTxHash = await ckb.rpc.sendTransaction(signedTx)
  //   /**
  //    * to see the real transaction hash
  //    */
  //   // console.log(`The real transaction hash is: ${realTxHash}`)
  // }

  const main = async () => {

    const ckb: CKBCore = new CKBCore(nodeUri)
    // await ckb.loadDeps()
    console.log('account', account)
    // account.address = 'ckt1qyqy84gfm9ljvqr69p0njfqullx5zy2hr9kq0pd3n5'
    // console.log('account.address', account.address)
    const mylock = ckb.utils.addressToScript(account.address)
    // console.log('addressToScript', mylock)

    unspentCellsRef.current = await ckb.loadCells({ indexer, CellCollector, lock: mylock })

    let countBalance = 0
    unspentCellsRef.current.forEach(item => countBalance += parseInt(item.capacity, 16))
    setBalance(countBalance)
  }

  useEffect((() => {

    main()

  }), [])

  const onSubmit = () => {
    console.log(toAddress, amount)
    // transfer()
  }


  return (
    <MainContainer>
      <VStack spacing="5vh">
        {!!balance && <Box bg='tomato' w='100%' p={4} color='white'>
          可用余额：{(balance / 100000000).toFixed(9)} CKB
        </Box>}
        <Textarea
          placeholder="Transfer address"
          onChange={e => setToAddress(e.target.value)}
        />
        <Input
          type='number'
          placeholder='Transfer value'
          onChange={e => setVal(e.target.value)}
        />
        <Button isFullWidth onClick={onSubmit} isDisabled={amount === '' || toAddress === ''} colorScheme="blue">
          Confirm
        </Button>
        <Button isFullWidth onClick={() => navi(RoutePath.Home)}>
          Go Home
        </Button>
      </VStack>
    </MainContainer>
  )
}
