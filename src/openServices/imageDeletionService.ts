import fs from 'fs'
import path from 'path'
import log from '../utils/logger'

class ImageDeletionService {
  deleteProductImage(imageUrl: string) {
    const storagePath = path.join(__dirname, '..', 'public', 'images')
    const pathToImage = `${storagePath}/${imageUrl}`

    fs.stat(pathToImage, (error: any, stat) => {
      if (error) {
        log.error(`${pathToImage} does not exist`)
      } else {
        fs.unlink(pathToImage, error => {
          if (error) throw error
        })
        log.info('File deleted successfully')
      }
    })
  }
}

export default ImageDeletionService
