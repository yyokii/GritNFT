// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/utils/Strings.sol';
import 'hardhat/console.sol';
import {Base64} from './libraries/Base64.sol';

contract GritNFT is ERC721Enumerable {
  struct NftAttributes {
    string name;
    string imageSVG;
    string description;
    uint256 createdAt;
    uint256 dueDate;
    uint256 achievedAt;
  }

  mapping(uint256 => NftAttributes) private _grit3Nfts;

  using Counters for Counters.Counter;

  string baseSvg =
    "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";

  Counters.Counter private _tokenIds;

  event NewNFTMinted(
    address sender,
    uint256 tokenId,
    string name,
    string description,
    uint256 createdAt,
    uint256 dueDate
  );

  constructor() ERC721('GritNFT', 'Grit') {
    console.log('This is GritNFT contract.');
  }

  /**
   * @dev Mints a new NFT.
   */
  function makeNFT(
    string memory name,
    string memory description,
    uint256 dueDate
  ) public {
    // TODO: dueDate should be in the future

    uint256 newTokenId = _tokenIds.current();
    uint256 createdAt = block.timestamp;

    _safeMint(msg.sender, newTokenId);
    console.log('An NFT w/ ID %s has been minted to %s', newTokenId, msg.sender);

    string memory imageSVG = generateSVG(name, createdAt, dueDate, 0);
    NftAttributes memory attributes = NftAttributes(
      name,
      imageSVG,
      description,
      createdAt,
      dueDate,
      0
    );

    _grit3Nfts[newTokenId] = attributes;

    _tokenIds.increment();

    emit NewNFTMinted(msg.sender, newTokenId, name, description, createdAt, dueDate);
  }

  function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
    _requireMinted(tokenId);

    NftAttributes memory nft = _grit3Nfts[tokenId];

    string memory encodedJson = Base64.encode(
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
            '"image": "',
            nft.imageSVG,
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
    console.log('encodedJson: %s', encodedJson);
    string memory output = string(abi.encodePacked('data:application/json;base64,', encodedJson));
    return output;
  }

  function generateSVG(
    string memory name,
    uint256 createdAt,
    uint256 dueDate,
    uint256 achievedAt
  ) private view returns (string memory) {
    string memory status = achievedAt == 0 ? 'In progress' : 'Achieved';
    string memory svg = string(abi.encodePacked(baseSvg, status, ' ', name, '</text></svg>'));
    string memory encodedSvg = Base64.encode(bytes(svg));
    return string(abi.encodePacked('data:image/svg+xml;base64,', encodedSvg));
  }

  function getTokenIds(address owner) public view returns (uint256[] memory) {
    uint256[] memory tokensOfOwner = new uint256[](ERC721.balanceOf(owner));

    uint256 i;
    for (i = 0; i < ERC721.balanceOf(owner); i++) {
      tokensOfOwner[i] = ERC721Enumerable.tokenOfOwnerByIndex(owner, i);
    }
    return (tokensOfOwner);
  }

  function getMetadatas(uint256[] memory tokenIds) public view returns (NftAttributes[] memory) {
    // TODO: check if tokenIds are valid

    NftAttributes[] memory datas = new NftAttributes[](tokenIds.length);

    uint256 i;
    for (i = 0; i < tokenIds.length; i++) {
      datas[i] = _grit3Nfts[tokenIds[i]];
    }
    return (datas);
  }

  // TODO: modifierにしてもいいかもしれない
  function isOwnerOf(uint256 tokenId) public view returns (bool) {
    bool result = msg.sender == ownerOf(tokenId);
    console.log('isOwnerOf: %s', result);
    return result;
  }

  function updateNFTOf(uint256 tokenId) public payable {
    require(isOwnerOf(tokenId), 'You are not owner of this NFT.');

    if (isExpiredOf(tokenId)) {
      console.log('This NFT is before the due date.');
      updateNFTDataOf(tokenId);
    } else {
      console.log('This NFT is after the due date.');
      if (msg.value >= 0.01 ether) {
        console.log('This NFT is after the due date.');
        updateNFTDataOf(tokenId);
      } else {
        console.log('You need to pay 0.01 ether.');
      }
    }
  }

  function updateNFTDataOf(uint256 tokenId) private {
    _requireMinted(tokenId);
    NftAttributes memory nft = _grit3Nfts[tokenId];
    nft.achievedAt = block.timestamp;
    nft.imageSVG = generateSVG(
      nft.name,
      nft.createdAt,
      nft.dueDate,
      nft.achievedAt
    );
    _grit3Nfts[tokenId] = nft;
  }

  function isExpiredOf(uint256 tokenId) public view returns (bool) {
    NftAttributes memory nft = _grit3Nfts[tokenId];
    bool result = nft.dueDate < block.timestamp;
    console.log('isExpiredOf: %s', result);
    return result;
  }
}
