import { Text, VStack } from '@chakra-ui/react'
import FeaturesList from '../components/FeaturesList'
import Hero from '../components/Hero'
import Layout from '../components/Layout'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import NormalButton from '../components/common/NormalButton'
import { Web3Storage } from 'web3.storage'
import GritNFT from '../grit-nfts.json'

interface Window {
  ethereum?: ethers.providers.ExternalProvider
}

export default function Home() {
  const [account, setAccount] = useState<string>(null)

  // NFT metadata
  const [nftName, setNftName] = useState<string>(null)
  const [nftDescription, setNftDescription] = useState<string>(null)
  const [nftDueDate, setNftDueDate] = useState<number>(null)

  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    ;(async () => {
      await checkIfWalletIsConnected()
      await checkNetwork()
    })()
  }, [])

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window as Window
    if (!ethereum) {
      console.log('Make sure you have MetaMask!')
      return
    } else {
      console.log('We have the ethereum object', ethereum)
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' })

    if (accounts.length !== 0) {
      const account = accounts[0]
      console.log('Found an authorized account:', account)
      setAccount(account)
      // setupEventListener()
    } else {
      console.log('No authorized account found')
    }
  }

  const checkNetwork = async () => {
    const { ethereum } = window as Window
    let chainId = await ethereum.request({ method: 'eth_chainId' })
    console.log('Connected to chain ' + chainId)
    // 0x5はGoerliのID
    const goerliChainId = '0x5'
    if (chainId !== goerliChainId) {
      alert('You are not connected to the Goerli Test Network.')
    }
  }

  const connectWallet = async () => {
    setIsSending(true)
    try {
      const { ethereum } = window as Window
      if (!ethereum) {
        alert('Get wallet firtt.')
        return
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      })
      console.log('Connected', accounts[0])
      setAccount(accounts[0])
      // setupEventListener()
      setIsSending(false)
    } catch (error) {
      setIsSending(false)
      console.log(error)
    }
  }

  const requestContractToMint = async (ipfs: string) => {
    // TODO: アドレスを修正する
    setIsSending(true)
    try {
      const { ethereum } = window as Window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(
          '0x5FbDB2315678afecb367f032d93F642f64180aa3',
          GritNFT.abi,
          signer,
        )
        const transaction = await contract.makeNFT(nftName, nftDescription, ipfs, nftDueDate)
        await transaction.wait()
        console.log(`${ipfs} minted!`)
        // TOOD: uplodat metadata to firestore for caching
        setIsSending(false)
      } else {
        console.log('Ethereum object not found')
      }
    } catch (error) {
      setIsSending(false)
      console.log(error)
    }
  }

  const imageToNFT = async (e) => {
    const client = new Web3Storage({ token: process.env.NEXT_PUBLIC_WEB3_STORAGE_API_KEY })
    const image = e.target
    console.log(image)

    const rootCid = await client.put(image.files, {
      name: 'nft grit image',
      maxRetries: 3,
    })
    const res = await client.get(rootCid)
    const files = await res.files()

    // TODO: 先頭のファイルのみを取得でいい気がする
    for (const file of files) {
      console.log('file.cid:', file.cid)
      requestContractToMint(file.cid)
    }
  }

  return (
    <Layout>
      <VStack spacing={4} align='center'>
        <Hero />
        <FeaturesList />
        {/* アカウント情報 */}
        {account ? (
          <Text color={'green.500'}>Connected to {account}</Text>
        ) : (
          <NormalButton title='Connect wallet' isSending={isSending} onClick={connectWallet} />
        )}
      </VStack>
    </Layout>
  )
}
