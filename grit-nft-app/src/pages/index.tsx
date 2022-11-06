import { Box, Button, Image, Input, SimpleGrid, Text, VStack } from '@chakra-ui/react'
import FeaturesList from '../components/FeaturesList'
import Hero from '../components/Hero'
import Layout from '../components/Layout'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import NormalButton from '../components/common/NormalButton'
import GritNFT from '../grit-nfts.json'
import { NFTMetadata } from '../types/nftMetadata'

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

      await checkIfWalletIsConnected()
    })()
  }, [])

  // Methods

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

  // Event handlers

  const onClickConnectWallet = async () => {
    await requestToConnectWallet()
    await checkIfWalletIsConnected()
  }

  const makeNFT = async () => {
    setIsSending(true)
    try {
      const requestMetadata = new NFTMetadata(-1, nftName, nftDescription, '', -1, nftDueDate, 0)
      console.log('start mint NFT')
      console.log('request metadata: ', requestMetadata)
      await requestContractToMint(requestMetadata)
      console.log('finish mint NFT')
      fetchUserAllNFTs()

      setIsSending(false)
    } catch (error) {
      setIsSending(false)
      console.log(error)
    }
  }

  const fetchUserAllNFTs = async () => {
    setIsSending(true)
    try {
      const tokenIDs = await gritNFTContract.getTokenIds(account)
      console.log('getTokenIds', tokenIDs.length)
      const metadatas = await gritNFTContract.getMetadatas(tokenIDs)

      const nftMetadatas: NFTMetadata[] = []
      for (let i = 0; i < tokenIDs.length; i++) {
        const data = NFTMetadata.fromJSON(metadatas[i], tokenIDs[i])
        nftMetadatas.push(data)
      }
      console.log('nftMetadatas', nftMetadatas)
      setUserNFTs(nftMetadatas)
    } catch (error) {
      console.log(error)
    }
  }

  const demo = async () => {
    fetchUserAllNFTs()
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
        <Box>
          <SimpleGrid columns={{ sm: 2, md: 3 }} spacing='40px'>
            {userNFTs.map((data) => (
              <Box key={data.tokenID}>
                <Text>{data.name}</Text>
                <Image src={data.imageSVG} alt={data.name} />
                <Text>{data.description}</Text>
                <Text>{data.dueDate}</Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
        <Button onClick={makeNFT}>Create NFT</Button>
        <Button onClick={demo}>Demo</Button>
      </VStack>
    </Layout>
  )
}
