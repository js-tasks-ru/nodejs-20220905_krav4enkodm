import {Schema, Types} from 'mongoose';
import connection from '../libs/connection';

interface IProduct {
  title: string;
  description: string;
  price: number;
  category: Types.ObjectId;
  subcategory: Types.ObjectId;
  images?: string[];
}

const productSchema = new Schema<IProduct>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  subcategory: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  images: [String],
});

export default connection.model('Product', productSchema);
