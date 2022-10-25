// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import 'hardhat/console.sol';
import {Base64} from './libraries/Base64.sol';

// ERC721URIStorage is suitable?
contract GritNFT is ERC721URIStorage, ERC721Enumerable {
  using Counters for Counters.Counter;

  Counters.Counter private _tokenIds;

  string baseSvg =
    "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";

  constructor() ERC721('GritNFT', 'Grit') {
    console.log('This is GritNFT contract.');
  }

  function getTokenIds(address _owner) public view returns (uint256[] memory) {
    uint256[] memory _tokensOfOwner = new uint256[](balanceOf(_owner));
    uint256 i;

    for (i = 0; i < balanceOf(_owner); i++) {
      _tokensOfOwner[i] = tokenOfOwnerByIndex(_owner, i);
    }
    return (_tokensOfOwner);
  }

  function makeNFT() public {
    uint256 newItemId = _tokenIds.current();

    string memory tokenSvg = string(abi.encodePacked(baseSvg, 'demo', '</text></svg>'));
    string memory json = Base64.encode(
      bytes(
        string(
          abi.encodePacked(
            '{"name": "',
            // NFTのタイトルを生成される言葉（例: GrandCuteBird）に設定します。
            'demo',
            '", "description": "A highly acclaimed collection of squares.", "image": "data:image/svg+xml;base64,',
            Base64.encode(bytes(tokenSvg)),
            '"}'
          )
        )
      )
    );
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

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal override(ERC721, ERC721Enumerable) {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
    super._burn(tokenId);
  }

  function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721, ERC721URIStorage)
    returns (string memory)
  {
    return super.tokenURI(tokenId);
  }

  function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721, ERC721Enumerable)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }
}
