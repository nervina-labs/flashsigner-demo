import { VStack, Textarea, Button, Input, Box } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { MainContainer } from '../../components/Container'
import { RoutePath } from '../../routes/path'
import { useAccount } from '../../hooks/useAccount'

import CKBCore from '@nervosnetwork/ckb-sdk-core'
import { Indexer, CellCollector } from "@ckb-lumos/ckb-indexer"
import { generateFlashsignerLockScript, signTransactionWithRedirect } from '@nervina-labs/flashsigner'
import camelcaseKeys from 'camelcase-keys'

const nodeUri = "https://testnet.ckb.dev/rpc"
const indexUri = "https://testnet.ckb.dev/indexer"

const indexer = new Indexer(indexUri, nodeUri)
indexer.startForever()
interface Lock {
  args: string;
  codeHash: string;
  hashType: CKBComponents.ScriptHashType;
}
interface Transfer {
  fromAddress: string,
  toAddress: string,
  amount: number
}

interface CellRef {
  current?: RawTransactionParams.Cell[]
}
interface CkbRef {
  current?: CKBCore
}
interface MyLock {
  current?: Lock
}

const utils = {
  getInputs: (cells: Array<RawTransactionParams.Cell>, transferCapacity: bigint, fee: bigint) => {
    const useCells: Array<RPC.CellInput> = []
    let countCapacity = BigInt(0)
    const costCapacity = (transferCapacity + fee)
    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i]
      countCapacity += BigInt(cell.capacity)
      useCells.push({
        previous_output: {
          tx_hash: cell.outPoint.txHash,
          index: cell.outPoint.index
        },
        since: '0x0'
      })

      if (countCapacity >= costCapacity) {
        break
      }
    }

    console.log('Input capacity is not enough')
    return {
      inputs: useCells,
      leftCapacity: countCapacity - costCapacity
    }
  },

  getOutputs: ({
    mylock,
    targetLock,
    payCapacity,
    leftCapacity
  }: {
    mylock: Lock,
    targetLock: Lock,
    payCapacity: BigInt,
    leftCapacity: BigInt
  }) => {
    const outputs = [{
      "capacity": `0x${payCapacity.toString(16)}`,
      "lock": {
        "code_hash": targetLock.codeHash,
        "hash_type": targetLock.hashType,
        "args": targetLock.args
      }
    }]

    if (leftCapacity !== BigInt(0)) {
      outputs.push({
        "capacity": `0x${leftCapacity.toString(16)}`,
        "lock": {
          "code_hash": mylock.codeHash,
          "hash_type": mylock.hashType,
          "args": mylock.args
        }
      })
    }
    return outputs
  }
}

export const CKB: React.FC = () => {
  const location = useLocation()

  const state = location.state as any ?? {}
  const navi = useNavigate()
  const { account } = useAccount()
  const [toAddress, setToAddress] = useState(state?.toAddress ?? '')
  const [amount, setVal] = useState(state?.amount ?? '')
  const [signTx, setSignTx] = useState(state?.tx ?? '')
  const [balance, setBalance] = useState(0)
  const unspentCellsRef: CellRef = useRef()
  const ckbRef: CkbRef = useRef()
  const lockRef: MyLock = useRef()

  const goRemoteSign = ({
    tx,
    toAddress,
    amount
  }: {
    tx: RPC.RawTransaction,
    toAddress: string,
    amount: number
  }) => {
    try {
      signTransactionWithRedirect(`${window.location.origin}${RoutePath.Flashsigner}`, {
        tx: tx as RPC.Transaction,
        extra: {
          type: 'CKB',
          toAddress: toAddress,
          amount,
        }
      })
    } catch (error) {
      console.log('error', error)
      alert('not a valid transaction, please enter a valid JSON transaction')
    }
  }

  const toSign = async ({ fromAddress, toAddress, amount }: Transfer) => {
    const ckb = ckbRef.current
    const unspentCells = unspentCellsRef.current

    if (!ckb ||
      !ckb?.config?.secp256k1Dep ||
      !unspentCells?.length) {
      return
    }

    const fee = 100_000n
    const { inputs, leftCapacity } = utils.getInputs(unspentCells, BigInt(amount), fee)
    const outputs = utils.getOutputs({
      mylock: ckb.utils.addressToScript(fromAddress),
      targetLock: ckb.utils.addressToScript(toAddress),
      payCapacity: BigInt(amount),
      leftCapacity: BigInt(leftCapacity)
    })

    const tx: RPC.RawTransaction = {
      version: '0x0',
      inputs,
      outputs,
      witnesses: [],
      outputs_data: outputs.map(() => ('0x')),
      header_deps: [],
      cell_deps: [],
    }

    goRemoteSign({
      tx,
      toAddress,
      amount
    })

  }

  const main = async () => {
    const ckb = ckbRef.current = new CKBCore(nodeUri)
    await ckb.loadDeps()
    const lock = lockRef.current = ckb.utils.addressToScript(account.address)
    unspentCellsRef.current = await ckb.loadCells({ indexer, CellCollector, lock })
    let countBalance = 0
    unspentCellsRef.current.forEach(item => countBalance += parseInt(item.capacity, 16))
    setBalance(countBalance)
  }

  useEffect((() => {
    main()
  }), [])

  const onSign = async () => {
    if (!toAddress) {
      alert('The address cannot empty.')
      return
    }

    if (!amount) {
      alert('The amount cannot empty.')
      return
    }

    if (amount > balance) {
      alert('Balance is not enough to pay.')
      return
    }

    await toSign({
      fromAddress: account.address,
      toAddress: toAddress,
      amount: amount
    })
  }

  const onTransfer = async () => {
    const ckb = ckbRef.current
    if (!ckb) {
      alert('Try again.')
      return
    }
    const formatTx = camelcaseKeys(signTx, { deep: true })
    const realTxHash = await ckb.rpc.sendTransaction(formatTx)
    console.log(`real tx hash is: ${realTxHash}`)
    alert(`real tx hash is: ${realTxHash}`)
  }

  return (
    <MainContainer>
      <VStack spacing="5vh">
        {!!balance && <Box bg='tomato' w='100%' p={4} color='white'>
          可用余额：{(balance / 100000000).toFixed(9)} CKB
        </Box>}
        <Textarea
          placeholder="Transfer address"
          value={toAddress}
          onChange={e => setToAddress(e.target.value)}
        />
        <Input
          type='number'
          value={amount}
          placeholder='Transfer amount'
          onChange={e => setVal(e.target.value)}
        />
        <Textarea
          disabled
          placeholder="sign tx"
          value={JSON.stringify(signTx)}
        />
        <Button isFullWidth onClick={onSign} isDisabled={amount === '' || toAddress === ''} colorScheme="blue">
          Go Sign
        </Button>

        <Button isFullWidth onClick={onTransfer} isDisabled={signTx === ''} colorScheme="blue">
          Confirm
        </Button>

        <Button isFullWidth onClick={() => navi(RoutePath.Home)}>
          Go Home
        </Button>
      </VStack>
    </MainContainer>
  )
}
