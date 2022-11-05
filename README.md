# Grit NFT

## Develop

### Deploy to local network

in grit-nfts directory

```.sh
npx hardhat node
```

and in another terminal

```.sh
npx hardhat run scripts/deploy.ts --network localhost
```

and update the contract address in App.

### Deploy to test network(Goerli)

in grit-nfts directory

```.sh
npx hardhat run scripts/deploy.ts --network goerli
```

and update the contract address in App.

### Start app devlop environment

in grit-nft-app directory

```.sh
yarn dev
```

### Update Contract

1. Deploy contract:

in grit-nfts directory

```.sh
npm run local
```

2. Update contract address in grit-nft-app

3. Update ABI file in grit-nft-app
