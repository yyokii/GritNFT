const runDeploy = async () => {
  try {
    // Deploy the contract
    const nftContractFactory = await hre.ethers.getContractFactory('GritNFT')
    const nftContract = await nftContractFactory.deploy()
    await nftContract.deployed()
    console.log('Contract deployed to:', nftContract.address)

    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

runDeploy()
