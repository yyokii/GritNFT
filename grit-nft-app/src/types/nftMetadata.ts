import { DocumentData, QueryDocumentSnapshot, WithFieldValue } from '@firebase/firestore'

class NFTMetadata {
  id: string
  tokenID: number
  name: string
  description: string
  imageSVG: string
  createdAt: number
  dueDate: number
  achivedAt: number

  constructor(
    id: string,
    tokenID: number,
    name: string,
    description: string,
    imageSVG: string,
    createdAt: number,
    dueDate: number,
    achivedAt: number,
  ) {
    this.id = id
    this.tokenID = tokenID
    this.name = name
    this.description = description
    this.imageSVG = imageSVG
    this.createdAt = createdAt
    this.dueDate = dueDate
    this.achivedAt = achivedAt
  }
}

export { NFTMetadata }
