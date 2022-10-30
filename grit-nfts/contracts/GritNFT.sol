// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/utils/Strings.sol';
import 'hardhat/console.sol';
import {Base64} from './libraries/Base64.sol';

/*
checkStatus: 
情報確認して特定期間内なら変更可能であると通知するやつ
特定のアドレス？uriから引いてそのメタデータを取得して、チェック結果をイベントを送信

*/
contract GritNFT is ERC721 {
  struct NftAttributes {
    string name;
    string imageURL;
    string description;
    uint256 createdAt;
    uint256 dueDate;
  }

  mapping(uint256 => NftAttributes) private _grit3Nfts;

  using Counters for Counters.Counter;

  Counters.Counter private _tokenIds;

  constructor() ERC721('GritNFT', 'Grit') {
    console.log('This is GritNFT contract.');
  }

  /**
   * @dev Mints a new NFT.
   */
  function makeNFT(
    string memory name,
    string memory description,
    string memory imageURI,
    uint256 dueDate
  ) public {
    uint256 newTokenId = _tokenIds.current();
    uint256 createdAt = block.timestamp;

    _safeMint(msg.sender, newTokenId);
    console.log('An NFT w/ ID %s has been minted to %s', newTokenId, msg.sender);

    NftAttributes memory attributes = NftAttributes(
      name,
      imageURI,
      description,
      createdAt,
      dueDate
    );

    _grit3Nfts[newTokenId] = attributes;

    _tokenIds.increment();
  }

  function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
    _requireMinted(tokenId);

    NftAttributes memory nft = _grit3Nfts[tokenId];

    string memory json = Base64.encode(
      bytes(
        string(
          abi.encodePacked(
            '{"name":',
            '"',
            nft.name,
            '",',
            '"description":',
            '"',
            nft.description,
            '",',
            '"image": ',
            '"',
            nft.imageURL,
            '",',
            '"attributes": [',
            '{"display_type": "date", "trait_type": "created_at", "value": "',
            Strings.toString(nft.createdAt),
            '"},',
            '{"display_type": "date", "trait_type": "due_date", "value": "',
            Strings.toString(nft.dueDate),
            '"}',
            ']',
            '}'
          )
        )
      )
    );
    console.log('json: %s', json);
    string memory tokenUri = string(abi.encodePacked('data:application/json;base64,', json));
  }

  // TODO: modifierにしてもいいかもしれない
  function isOwnerOf(uint256 tokenId) public view returns (bool) {
    bool result = msg.sender == ownerOf(tokenId);
    console.log('isOwnerOf: %s', result);
    return result;
  }

  /*
  read current nft
  → check metadata （これはマッピング情報から取れる）
  → update metadata 
  */
  function updateNFTOf(uint256 tokenId, string memory imageURI) public {
    require(isOwnerOf(tokenId), 'You are not owner of this NFT.');

    string memory tokenUri = tokenURI(tokenId);
    console.log('tokenUri: %s', tokenUri);
  }
}
