async function runLocal() {
  try {
    // Deploy the contract
    const nftContractFactory = await hre.ethers.getContractFactory('GritNFT')
    const nftContract = await nftContractFactory.deploy()
    await nftContract.deployed()
    console.log('Contract deployed to:', nftContract.address)

    let txn = await nftContract.makeNFT('demo name', 'demo description', 1672458033)
    await txn.wait()

    await nftContract.isExpiredOf(0)
    await nftContract.tokenURI(0)

    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

runLocal()
