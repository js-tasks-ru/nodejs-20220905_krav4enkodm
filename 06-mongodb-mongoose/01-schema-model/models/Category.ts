import {Schema, model} from 'mongoose';

interface ISubcategory {
  title: string;
}

interface ICategory {
  title: string;
  subcategories: ISubcategory[];
}

const subCategorySchema = new Schema<ISubcategory>({
  title: {
    type: String,
    required: true,
  },
});

const categorySchema = new Schema<ICategory>({
  title: {
    type: String,
    required: true,
  },
  subcategories: [subCategorySchema],
});

export default model<ICategory>('Category', categorySchema);
