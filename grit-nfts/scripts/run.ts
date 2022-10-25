async function main() {
  const nftContract = await deploy('GritNFT')

  let txn = await nftContract.makeNFT()
  await txn.wait()
}

async function deploy(name: String): Promise<any> {
  const nftContractFactory = await hre.ethers.getContractFactory(name)
  const nftContract = await nftContractFactory.deploy()
  await nftContract.deployed()
  console.log('Contract deployed to:', nftContract.address)
  return nftContract
}

async function runMain() {
  try {
    await main()
    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

runMain()
