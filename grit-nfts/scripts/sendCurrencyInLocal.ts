import { ethers } from 'hardhat'

async function main() {
  const transactionSend = {
    to: '0x0CF4e589e3213F482ed897B38d69Be90002325A5',
    value: ethers.utils.parseEther('10.0'),
  }

  const [account] = await ethers.getSigners()
  await account.sendTransaction(transactionSend)
  console.log('success')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
