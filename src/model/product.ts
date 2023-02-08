import {
  Description,
  Id,
  ImageUrl,
  Price,
  Money,
  Name,
  ShortDescription,
} from '../model/valueObjects'

class ProductEntity {
  constructor(
    public id: Id,
    public name: Name,
    public short_description: ShortDescription,
    public description: Description,
    public price: Price | Money,
    public image_url: ImageUrl
  ) {}
}

export default ProductEntity
