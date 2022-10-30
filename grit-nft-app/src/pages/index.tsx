import { Text, VStack } from '@chakra-ui/react'
import FeaturesList from '../components/FeaturesList'
import Hero from '../components/Hero'
import Layout from '../components/Layout'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import NormalButton from '../components/common/NormalButton'

interface Window {
  ethereum?: ethers.providers.ExternalProvider
}

export default function Home() {
  const [account, setAccount] = useState<string>(null)
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
