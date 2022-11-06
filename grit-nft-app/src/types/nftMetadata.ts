import { BigNumber } from 'ethers'

class NFTMetadata {
  tokenID: number
  name: string
  description: string
  imageSVG: string
  createdAt: number
  dueDate: number
  achievedAt: number

  constructor(
    tokenID: number,
    name: string,
    description: string,
    imageSVG: string,
    createdAt: number,
    dueDate: number,
    achievedAt: number,
  ) {
    this.tokenID = tokenID
    this.name = name
    this.description = description
    this.imageSVG = imageSVG
    this.createdAt = createdAt
    this.dueDate = dueDate
    this.achievedAt = achievedAt
  }

  static fromJSON(json: any, tokenID: number): NFTMetadata {
    const createdAt: number = (json.createdAt as BigNumber).toNumber()
    const dueDate: number = (json.dueDate as BigNumber).toNumber()
    const achievedAt: number = (json.achievedAt as BigNumber).toNumber()

    return new NFTMetadata(
      tokenID,
      json.name,
      json.description,
      json.imageSVG,
      createdAt,
      dueDate,
      achievedAt,
    )
  }
}

export { NFTMetadata }
