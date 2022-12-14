## dev tips

- Tags
  - https://docs.soliditylang.org/en/develop/natspec-format.html#tags
- Common Patterns
  - https://docs.soliditylang.org/en/v0.8.17/common-patterns.html
- Payable
  - https://solidity-by-example.org/payable/
- Re-Entrancy
  - https://solidity-by-example.org/hacks/re-entrancy/
- solidity memory nad calldata
  - https://ethereum.stackexchange.com/questions/74442/when-should-i-use-calldata-and-when-should-i-use-memory
- ERC721
  - https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol
- OpenSea のメタデータ仕様
  - https://docs.opensea.io/docs/metadata-standards
- address(0)は特殊なケースで使用される
  - https://stackoverflow.com/questions/48219716/what-is-address0-in-solidity
  - https://docs.soliditylang.org/en/v0.8.17/introduction-to-smart-contracts.html
- require, assert, revert
  - https://ethereum.stackexchange.com/questions/15166/difference-between-require-and-assert-and-the-difference-between-revert-and-thro?answertab=votes#tab-top
- IPFS にアップロードした画像を表示
  - https://web3.storage/docs/examples/image-gallery/#viewing-images
- オンチェーンでの実行結果はトランザクション経由でとれそう
  - https://ethereum.stackexchange.com/questions/88119/i-see-no-way-to-obtain-the-return-value-of-a-non-view-function-ethers-js

## memo

- ipsf の反映遅い。upload 後に https://でアクセスすると 30m ぐらいは 504 bad gateway になる
  - これに限らず opensea などでもすぐデータが見られないことがある
  - 原因の判別つきづらい
  - error にも書いてるように接続エラーが時折発生する。ファイルはメタデータのメインコンテンツになることが多いのでここに依存するのは UX 的にも開発体験的にも良くない気がする
- コントラクトの処理はどんな時に競合状態になる？
- .wait() は書き込み処理のときだけ待つために呼べばいい？
- prettier の onSave が効かない
- firestore への書き込みに制限つけるなら認証機構が必要
- ethers の event を listen して、任意の event が発火した際に web ページを再リロードするとまた発火する
  - https://ethereum.stackexchange.com/questions/117469/ethers-js-event-firing-question

## error

IPFS へのアップロード後にすぐに読み取りにいくと以下のエラーが出る

```
Error: block with cid bafybeiggpov7l3bokdcw4f66nvfjxiyu4rcocki6rg7ukshz4nn3lebdni no found

```

→ 同じ内容の issue: https://github.com/web3-storage/web3.storage/issues/1810
