import config from 'config'
import {
  Description,
  Id,
  ImageUrl,
  Price,
  Money,
  Name,
  ShortDescription,
  Quantity,
  Category,
} from '../model/valueObjects'

const host = config.get<string>('host')

class ProductEntity {
  constructor(
    public id: Id,
    public name: Name,
    public short_description: ShortDescription,
    public description: Description,
    public price: Price | Money,
    public image_url: ImageUrl,
    public quantity: Quantity,
    public category: Category,
    public user_id: Id
  ) {}

  toJSON() {
    return {
      id: this.id.value,
      name: this.name.value,
      short_description: this.short_description.value,
      description: this.description.value,
      price: (this.price as Money).valueToPrice().value,
      image_url: `${host}/${this.image_url.value}`,
      quantity: this.quantity.value,
      category: this.category.value,
      user_id: this.user_id.value,
    }
  }
}

export default ProductEntity
