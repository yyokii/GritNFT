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
- OpenSeaのメタデータ仕様
  -  https://docs.opensea.io/docs/metadata-standards
-  address(0)は特殊なケースで使用される
   -  https://stackoverflow.com/questions/48219716/what-is-address0-in-solidity
   -  https://docs.soliditylang.org/en/v0.8.17/introduction-to-smart-contracts.html
-  require, assert, revert
   -  https://ethereum.stackexchange.com/questions/15166/difference-between-require-and-assert-and-the-difference-between-revert-and-thro?answertab=votes#tab-top

## memo

* テストネットの通貨取得するの面倒
  * ローカル環境ほしい
* ipsfの反映遅い。upload後にhttps://でアクセスすると30mぐらいは504 bad gatewayになる
  * これに限らずopenseaなどでもすぐデータが見られないことがある
  * 原因の判別つきづらい
* コントラクトの処理はどんな時に競合状態になる？
* .wait() は書き込み処理のときだけ待つために呼べばいい？
* prettierのonSaveが効かない
