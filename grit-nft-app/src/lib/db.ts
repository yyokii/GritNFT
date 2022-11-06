import { firestore } from './firebase'
import { DBError } from '../types/baseError'
import { NFTMetadata, nftMetadataConverter } from '../types/nftMetadata'
import { collection, doc, setDoc } from 'firebase/firestore'

const uploadNFTMetadata = async (address: string, nftMetadata: NFTMetadata) => {
  try {
    console.log('uploading nft metadata')
    console.log(nftMetadata)
    const ref = doc(collection(firestore, 'users', address, 'nfts')).withConverter(
      nftMetadataConverter,
    )
    await setDoc(ref, nftMetadata)
  } catch (error) {
    throw new DBError(error)
  }
}

export { uploadNFTMetadata }
