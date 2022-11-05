import { Box, Button, Input, Text, VStack } from '@chakra-ui/react'
import FeaturesList from '../components/FeaturesList'
import Hero from '../components/Hero'
import Layout from '../components/Layout'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import NormalButton from '../components/common/NormalButton'
import { Web3Storage, CIDString } from 'web3.storage'
import GritNFT from '../grit-nfts.json'
import html2canvas from 'html2canvas'

interface Window {
  ethereum?: ethers.providers.ExternalProvider
}

// class GritNFTMetadata {
//   name: string
//   description: string
//   imageCID: string
// }

const CONTRACT_ADDRESS = '0x7100F290D619739D92559112337389E08C570736'

export default function Home() {
  const [account, setAccount] = useState<string>(null)

  // NFT metadata
  const [nftTitle, setnftTitle] = useState<string>('')
  const [nftDescription, setNftDescription] = useState<string>('')
  const [nftDueDate, setNftDueDate] = useState<number>(0)

  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    ;(async () => {
      await checkIfWalletIsConnected()
      // await checkNetwork()
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
      setupEventListener()
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
      setIsSending(false)
      setupEventListener()
    } catch (error) {
      setIsSending(false)
      console.log(error)
    }
  }

  const setupEventListener = async () => {
    try {
      const { ethereum } = window as Window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, GritNFT.abi, signer)

        connectedContract.on('NewNFTMinted', (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          alert(
            `NFTが送信されました!\nNFT へのリンクはこちらです: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}\nOpenSeaに表示されるまで最大で10分かかることがあります。`,
          )
        })
        console.log('Setup event listener')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const makeNFT = async () => {
    setIsSending(true)
    try {
      console.log('start mint NFT')
      console.log('nftTitle', nftTitle)
      console.log('nftDescription', nftDescription)
      console.log('nftDueDate', nftDueDate)
      const imageFile = await captureImage()
      const imageCID = await uploadToWeb3Storage(imageFile)
      await requestContractToMint(imageCID)
      // TODO: save NFT metadata to DB
      console.log('finish mint NFT')
      setIsSending(false)
    } catch (error) {
      setIsSending(false)
      console.log(error)
    }
  }

  const requestContractToMint = async (ipfs: CIDString) => {
    setIsSending(true)
    try {
      const { ethereum } = window as Window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(CONTRACT_ADDRESS, GritNFT.abi, signer)
        // stateを参照ではなく、オブジェクトにしてそれを渡していく方が良さそう、値変わるので
        const transaction = await contract.makeNFT(nftTitle, nftDescription, ipfs, nftDueDate)
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

  const uploadToWeb3Storage = async (file: File): Promise<CIDString> => {
    const client = new Web3Storage({ token: process.env.NEXT_PUBLIC_WEB3_STORAGE_API_KEY })
    const cid = await client.put([file], {
      name: 'nft grit image',
      maxRetries: 3,
    })
    console.log('Uploaded to web3 storage. CID:', cid)
    // const res = await client.get(rootCid)
    // const files = await res.files()
    // console.log('Uploaded file:', files[0])
    return cid
  }

  const captureImage = async (): Promise<File> => {
    const canvas = await html2canvas(document.getElementById('canvas'))
    const image = canvas.toDataURL('image/png')
    const blob: Blob = await fetch(image).then((r) => r.blob())

    const currentTime = Date.now() / 1000
    const file: File = new File([blob], `${currentTime}.png`, { type: 'image/png' })

    return file
  }

  const demoUpload = async () => {
    setIsSending(true)
    try {
      console.log('start demo upload')
      const file = await captureImage()
      const cid = await uploadToWeb3Storage(file)
      console.log('finish demo upload')
      console.log(cid)
      setIsSending(false)
    } catch (error) {
      console.log('error demo upload')
      setIsSending(false)
      console.log(error)
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
        <Box>
          <VStack>
            <Input
              id='title'
              placeholder='title'
              value={nftTitle}
              onChange={(e) => {
                setnftTitle(e.target.value)
              }}
              required
            />
            <Input
              id='description'
              placeholder='description'
              value={nftDescription}
              onChange={(e) => {
                setNftDescription(e.target.value)
              }}
              required
            />
            <Input
              id='due date'
              placeholder='Select Date'
              size='md'
              type='date'
              onChange={(e) => {
                const unixTime = new Date(e.target.value).getTime() / 1000
                setNftDueDate(unixTime)
              }}
              required
            />
          </VStack>
        </Box>
        <Box id='canvas'>
          <Text color={'red.500'} m={8}>
            This is {nftTitle} NFT
          </Text>
        </Box>
        <Button onClick={makeNFT}>Capture</Button>
      </VStack>
    </Layout>
  )
}
