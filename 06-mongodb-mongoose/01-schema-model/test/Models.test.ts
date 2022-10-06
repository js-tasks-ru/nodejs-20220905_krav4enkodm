// @ts-ignore

import mongoose from 'mongoose';
import {expect} from 'chai';
import Category from '../models/Category';
import Product from '../models/Product';
import connection from '../libs/connection';

describe('mongodb-mongoose/schema-model', () => {
  after(() => {
    connection.close();
  });

  describe('модель категории', () => {
    it('у модели есть поля title и subcategories', () => {
      const fields = Category.schema.obj;

      expect(fields, 'у модели есть поле title').to.have.property('title');
      expect(fields, 'у модели есть поле subcategories').to.have.property(
        'subcategories'
      );
    });

    it('поле title имеет правильную конфигурацию', () => {
      const title = Category.schema.obj.title;

      // @ts-expect-error
      expect(title.type, 'title - строковое поле').to.eql(String);
      // @ts-expect-error
      expect(title.required, 'title - обязательное поле').to.be.true;
    });

    it('поле subcategories имеет правильную конфигурацию', () => {
      const subcategories = Category.schema.obj.subcategories;

      expect(subcategories, 'subcategories - массив').to.be.an('array');
      // @ts-expect-error
      const title = subcategories[0].obj.title;
      expect(title.type, 'title - строковое поле').to.eql(String);
      expect(title.required, 'title - обязательное поле').to.be.true;
    });
  });

  describe('модель товара', () => {
    it('у модели есть поля: title, description, price, category, subcategory и images', () => {
      const fields = Product.schema.obj;

      expect(fields, 'у модели есть поле title').to.have.property('title');
      expect(fields, 'у модели есть поле description').to.have.property(
        'description'
      );
      expect(fields, 'у модели есть поле price').to.have.property('price');
      expect(fields, 'у модели есть поле category').to.have.property(
        'category'
      );
      expect(fields, 'у модели есть поле subcategory').to.have.property(
        'subcategory'
      );
      expect(fields, 'у модели есть поле images').to.have.property('images');
    });

    it('поле title имеет правильную конфигурацию', () => {
      const title = Product.schema.obj.title;

      // @ts-expect-error
      expect(title.type, 'title - строковое поле').to.eql(String);
      // @ts-expect-error
      expect(title.required, 'title - обязательное поле').to.be.true;
    });

    it('поле description имеет правильную конфигурацию', () => {
      const description = Product.schema.obj.description;
      // @ts-expect-error
      expect(description.type, 'description - строковое поле').to.eql(String);
      // @ts-expect-error
      expect(description.required, 'description - обязательное поле').to.be
        .true;
    });

    it('поле price имеет правильную конфигурацию', () => {
      const price = Product.schema.obj.price;
      // @ts-expect-error
      expect(price.type, 'price - числовое поле').to.eql(Number);
      // @ts-expect-error
      expect(price.required, 'price - обязательное поле').to.be.true;
    });

    it('поле category имеет правильную конфигурацию', () => {
      const category = Product.schema.obj.category;
      // @ts-expect-error
      expect(category.type, 'category - ObjectId').to.eql(
        mongoose.Schema.Types.ObjectId
      );
      // @ts-expect-error
      expect(category.required, 'category - обязательное поле').to.be.true;
    });

    it('поле subcategory имеет правильную конфигурацию', () => {
      const subcategory = Product.schema.obj.subcategory;

      // @ts-expect-error
      expect(subcategory.type, 'subcategory - ObjectId').to.eql(
        mongoose.Schema.Types.ObjectId
      );
      // @ts-expect-error
      expect(subcategory.required, 'subcategory - обязательное поле').to.be
        .true;
    });

    it('поле images имеет правильную конфигурацию', () => {
      const images = Product.schema.obj.images;

      expect(images, 'images - массив').to.be.an('array');
      // @ts-expect-error
      expect(images[0], 'images - массив строк').to.eql(String);
    });
  });
});
