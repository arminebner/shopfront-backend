import { Description, Id, ImageUrl, Money, Name, ShortDescription } from '../model/valueObjects'

class ProductEntity {
  constructor(
    public id: Id,
    public name: Name,
    public short_description: ShortDescription,
    public description: Description,
    public price: Money,
    public image_url: ImageUrl
  ) {}
}

export default ProductEntity
