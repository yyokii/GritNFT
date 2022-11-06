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

// const nftMetadataConverter = {
//   toFirestore(data: WithFieldValue<NFTMetadata>): DocumentData {
//     return {
//       tokenID: data.tokenID,
//       name: data.name,
//       description: data.description,
//       imageCID: data.imageCID,
//       createdAt: data.createdAt,
//       dueDate: data.dueDate,
//     }
//   },
//   fromFirestore(snapshot: QueryDocumentSnapshot): NFTMetadata {
//     const data = snapshot.data()
//     const nftMetadata = new NFTMetadata(
//       snapshot.id,
//       data.tokenID,
//       data.name,
//       data.description,
//       data.imageCID,
//       data.createdAt,
//       data.dueDate,
//     )
//     return nftMetadata
//   },
// }

export { NFTMetadata }
