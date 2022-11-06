import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
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
import { firestore } from '../lib/firebase'
import { NFTMetadata } from '../types/nftMetadata'
import { uploadNFTMetadata } from '../lib/db'

interface Window {
  ethereum?: ethers.providers.ExternalProvider
}

const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

export default function Home() {
  const [account, setAccount] = useState<string>(null)

  // NFT metadata
  const [nftName, setnftName] = useState<string>('')
  const [nftDescription, setNftDescription] = useState<string>('')
  const [nftDueDate, setNftDueDate] = useState<number>(0)

  // User's data
  const [userNFTs, setUserNFTs] = useState<NFTMetadata[]>([])

  const [isSending, setIsSending] = useState(false)
  const [gritNFTContract, setGritNFTContract] = useState<ethers.Contract>(null)

  const newNFTMintedEventName = 'NewNFTMinted'

  // Effect

  useEffect(() => {
    ;(async () => {
      // Set up contract
      const { ethereum } = window as Window
      const provider = new ethers.providers.Web3Provider(ethereum)
      const signer = provider.getSigner()
      const gritNFTContract = new ethers.Contract(CONTRACT_ADDRESS, GritNFT.abi, signer)
      setGritNFTContract(gritNFTContract)

      const isConnected = await checkIfWalletIsConnected()
      if (isConnected) {
        // setupEventListener(gritNFTContract)
      }
    })()
  }, [])

  // useEffect(() => {
  //   if (account == null) {
  //     return
  //   }

  //   const query = createBaseQueryOfNFTs(account)
  //   const unsubscribe = onSnapshot(query, (querySnapshot) => {
  //     const fetchedNFTMetadatas = querySnapshot.docs.map((doc) => {
  //       return doc.data() as NFTMetadata
  //     })
  //     setUserNFTs(fetchedNFTMetadatas)

  //     console.log('set user nfts: ', fetchedNFTMetadatas.length)
  //   })
  //   return unsubscribe
  // }, [account])

  // Methods

  // const createBaseQueryOfNFTs = (address: string) => {
  //   return query(
  //     collection(firestore, `users/${address}/nfts`),
  //     orderBy('createdAt', 'desc'),
  //   ).withConverter(nftMetadataConverter)
  // }

  const checkIfWalletIsConnected = async (): Promise<boolean> => {
    const { ethereum } = window as Window
    if (!ethereum) {
      console.log('Make sure you have MetaMask!')
      return false
    } else {
      console.log('We have the ethereum object', ethereum)
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' })

    if (accounts.length !== 0) {
      const account = accounts[0]
      console.log('Found an authorized account:', account)
      setAccount(account)
      return true
    } else {
      console.log('No authorized account found')
      return false
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

  const requestToConnectWallet = async () => {
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
      console.log('cuccrent accout', accounts[0])
      setIsSending(false)
    } catch (error) {
      setIsSending(false)
      console.log(error)
    }
  }

  const setupEventListener = async (contract: ethers.Contract) => {
    try {
      const { ethereum } = window as Window
      const provider = new ethers.providers.Web3Provider(ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(CONTRACT_ADDRESS, GritNFT.abi, signer)
      // https://github.com/ethers-io/ethers.js/issues/2310#issuecomment-982755859
      console.log('listeners', contract.listeners(newNFTMintedEventName))
      provider.once('block', () => {
        contract.on(
          newNFTMintedEventName,
          async (address, tokenId, name, description, imageCID, createdAt, dueDate) => {
            alert(
              `NFTが送信されました!\n
                address: ${address}\n
                tokenID: ${tokenId.toNumber()}\n
                name: ${name.toString()}\n
                description: ${description.toString()}\n
                CID: ${imageCID.toString()}\n
                createdAt: ${createdAt.toNumber()}\n
                dueDate: ${dueDate.toNumber()}`,
            )
            // const requestMetadata = new NFTMetadata(
            //   '',
            //   tokenId.toNumber(),
            //   name.toString(),
            //   description.toString(),
            //   imageCID.toString(),
            //   createdAt.toNumber(),
            //   dueDate.toNumber(),
            // )
            try {
              // await uploadNFTMetadata(account, requestMetadata)
            } catch (error) {
              console.log(error)
            }
          },
        )
      })
      console.log('Setup event listener')
    } catch (error) {
      console.log(error)
    }
  }

  const requestContractToMint = async (metadata: NFTMetadata) => {
    setIsSending(true)
    try {
      const transaction = await gritNFTContract.makeNFT(
        metadata.name,
        metadata.description,
        metadata.dueDate,
      )
      await transaction.wait()
      console.log(`${metadata} is minted`)
      setIsSending(false)
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

  // Event handlers

  const onClickConnectWallet = async () => {
    await requestToConnectWallet()
    await checkIfWalletIsConnected()
  }

  const makeNFT = async () => {
    setIsSending(true)
    try {
      const requestMetadata = new NFTMetadata(
        '',
        -1,
        nftName,
        nftDescription,
        '',
        -1,
        nftDueDate,
        0,
      )
      console.log('start mint NFT')
      console.log('request metadata: ', requestMetadata)
      // const imageFile = await captureImage()
      // const imageCID = await uploadToWeb3Storage(imageFile)
      // requestMetadata.imageCID = imageCID
      await requestContractToMint(requestMetadata)
      console.log('finish mint NFT')

      // データの一覧を取得
      const userTokenIds = await gritNFTContract.getTokenIds(account)
      console.log('userTokenIds', userTokenIds)
      const metadatas: NFTMetadata[] = await gritNFTContract.getMetadatas(userTokenIds)
      console.log('metadatas', metadatas)

      setIsSending(false)
    } catch (error) {
      setIsSending(false)
      console.log(error)
    }
  }

  const demo = async () => {
    try {
      const data = await gritNFTContract.getTokenIds(account)
      console.log('getTokenIds', data)
      for (let i = 0; i < data.length; i++) {
        const tokenId = data[i].toNumber()
        console.log('tokenId', tokenId)
      }
      const metadatas: NFTMetadata[] = await gritNFTContract.getMetadatas(data)
      console.log('getMetadatas', metadatas)
      console.log('getMetadatas image', metadatas[0].imageSVG)
    } catch (error) {
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
          <NormalButton
            title='Connect wallet'
            isSending={isSending}
            onClick={onClickConnectWallet}
          />
        )}
        <Box>
          <VStack>
            <Input
              id='title'
              placeholder='title'
              value={nftName}
              onChange={(e) => {
                setnftName(e.target.value)
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
            This is {nftName} NFT
          </Text>
        </Box>
        <Button onClick={makeNFT}>Create NFT</Button>
        <Button onClick={demo}>Demo</Button>
      </VStack>
    </Layout>
  )
}
