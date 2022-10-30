import { Box, VStack } from '@chakra-ui/react'
import FeaturesList from '../components/FeaturesList'
import Hero from '../components/Hero'
import Layout from '../components/Layout'

export default function Home() {
  return (
    <Layout>
      <VStack spacing={4} align='center'>
        <Hero />
        <FeaturesList />
      </VStack>
    </Layout>
  )
}
