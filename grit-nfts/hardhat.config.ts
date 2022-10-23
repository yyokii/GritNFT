import 'dotenv/config'
import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import '@nomiclabs/hardhat-etherscan'

const config: HardhatUserConfig = {
  solidity: '0.8.17',
}

export default config
