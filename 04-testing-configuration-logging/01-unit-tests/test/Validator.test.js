const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    it('валидатор проверяет тип', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({age: 'hello'});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0])
        .to.have.property('error')
        .and.to.be.equal('expect number, got string');
    });

    describe('валидатор проверяет строковые поля', () => {
      it('валидатор проверяет нижнюю границу', () => {
        const validator = new Validator({
          name: {
            type: 'string',
            min: 10,
            max: 20,
          },
        });

        const errors = validator.validate({name: 'Lalala'});

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0])
          .to.have.property('error')
          .and.to.be.equal('too short, expect 10, got 6');
      });

      it('валидатор проверяет верхнюю границу', () => {
        const validator = new Validator({
          name: {
            type: 'string',
            min: 10,
            max: 20,
          },
        });

        const errors = validator.validate({
          name: 'LalalaLalalaLalalaLalalaLalala',
        });

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0])
          .to.have.property('error')
          .and.to.be.equal('too long, expect 20, got 30');
      });
    });

    describe('валидатор проверяет числовые поля', () => {
      it('валидатор проверяет нижнюю границу', () => {
        const validator = new Validator({
          age: {
            type: 'number',
            min: 10,
            max: 20,
          },
        });

        const errors = validator.validate({age: 5});

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('age');
        expect(errors[0])
          .to.have.property('error')
          .and.to.be.equal('too little, expect 10, got 5');
      });

      it('валидатор проверяет верхнюю границу', () => {
        const validator = new Validator({
          age: {
            type: 'number',
            min: 10,
            max: 20,
          },
        });

        const errors = validator.validate({age: 21});

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('age');
        expect(errors[0])
          .to.have.property('error')
          .and.to.be.equal('too big, expect 20, got 21');
      });
    });

    describe('валидатор не возвращает ошибку при позитивном сценарии', () => {
      it('при работе с числами', () => {
        const validator = new Validator({
          age: {
            type: 'number',
            min: 10,
            max: 20,
          },
        });

        const errors = validator.validate({age: 15});

        expect(errors).to.have.length(0);
      });

      it('при работе со строками', () => {
        const validator = new Validator({
          name: {
            type: 'string',
            min: 4,
            max: 10,
          },
        });

        const errors = validator.validate({name: 'admin'});

        expect(errors).to.have.length(0);
      });
    });
  });
});
