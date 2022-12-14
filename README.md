# Grit NFT

## Web3 Hackathon 2022

⚠️ Goerli環境にデプロイしています。
デモ動画はローカル環境でのものです。

### プロダクト概要

Grit NFT はこれからやりたいことを NFT 化することで、モチベーションアップを図るアプリケーションです。  
例えば、1 ヶ月で 5 キロ痩せようと思っても誰かにお尻を叩かれたり期限がないとなかなか達成することが難しいです。  
このアプリではやりたいことと期限を宣言して NFT（オンチェーン） を作成できます。そして設定した期限以内に達成した場合はガス代のみで NFT を更新（達成状態に更新）することができますが、期限を過ぎると追加の費用がかかります。

* せっかく NFT を作ったのだから達成したい
* 期限内に終わらせることで NFT を更新したい  

というモチベーションがユーザーに生まれることで **やり抜く力「Grit」** を高めることができると思っています。
また、自分の過去のやったことややろうとしたことがブロックチェーン上で記録されたり、それを他の人に受け継いだりすることができるのも特徴です。

### tech stacks

- Solidity
- hardhat
- Next.js
- ethers.js

### Blockchain

Ethereum

https://www.blockchain.com/eth/address/0xc0F43D539883532d0A5099ebBc63F2C6A4B70ecC

### その他の file

- [Frontend App のリポジトリ](https://github.com/yyokii/GritNFTApp)

### ローカルでのテスト方法

下記の「Deploy to local network」をご覧下さい。

## Plan
今後の開発予定

* Fix UI
* Fix NFT image
* and ...

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

and send some currency for testing

```.sh
npx hardhat run scripts/sendCurrencyInLocal.ts --network localhost
```

and update the contract address in App.

### Deploy to test network(Goerli)

in grit-nfts directory

```.sh
npx hardhat run scripts/deploy.ts --network goerli
```

and update the contract address in App.

### Start devlop environment app 

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

## Tips

- [Solved! “Nonce too high” error with MetaMask and Hardhat - Jake Warren - Medium](https://medium.com/@thelasthash/solved-nonce-too-high-error-with-metamask-and-hardhat-adc66f092cd)
