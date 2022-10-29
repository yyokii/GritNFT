// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import "@openzeppelin/contracts/utils/Strings.sol";
import 'hardhat/console.sol';
import {Base64} from './libraries/Base64.sol';

/*
checkStatus: 情報確認して特定期間内なら変更可能であると通知するやつ

*/
contract GritNFT is ERC721URIStorage {
  using Counters for Counters.Counter;

  Counters.Counter private _tokenIds;

  string baseSvg =
    "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";

  constructor() ERC721('GritNFT', 'Grit') {
    console.log('This is GritNFT contract.');
  }

  function makeNFT() public {
    uint256 newItemId = _tokenIds.current();

    string memory tokenSvg = string(abi.encodePacked(baseSvg, 'demo', '</text></svg>'));
    uint createdAt = block.timestamp;
    uint dueDate = block.timestamp; // TODO

    string memory json = Base64.encode(
      bytes(
        string(
          abi.encodePacked(
            '{"name": "this is demo",',
            '"description": "A highly acclaimed collection of squares.",',
            '"image": "data:image/svg+xml;base64,', Base64.encode(bytes(tokenSvg)), '",', 
            '"attributes": [',
            '{"display_type": "date", "trait_type": "created_at", "value": "', Strings.toString(createdAt),'"},', 
            '{"display_type": "date", "trait_type": "due_date", "value": "', Strings.toString(dueDate),'"}', 
            ']',
            '}'
          )
        )
      )
    );
    console.log('json: %s', json);
    string memory tokenUri = string(abi.encodePacked('data:application/json;base64,', json));

    _safeMint(msg.sender, newItemId);
    _setTokenURI(newItemId, tokenUri);

    console.log('An NFT w/ ID %s has been minted to %s', newItemId, msg.sender);

    _tokenIds.increment();
  }

  /*
  read current nft
  → check metadata
  → update metadata
  */
  function updateNFT(string memory targetTokenURI) public {
    console.log('I made an NFT!');
  }
}
