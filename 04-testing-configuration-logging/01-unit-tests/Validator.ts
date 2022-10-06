type Rules = Record<
  string,
  {
    type: 'string' | 'number';
    min: number;
    max: number;
  }
>;

type Error = {
  field: string;
  error: string;
};

type Value = Record<string, string | number>;

export default class Validator {
  rules: Rules;

  constructor(rules: Rules) {
    this.rules = rules;
  }

  validate(obj: Value) {
    const errors: Error[] = [];

    for (const field of Object.keys(this.rules)) {
      const rules = this.rules[field];

      const value = obj[field];
      const type = typeof value;

      if (type !== rules.type) {
        errors.push({field, error: `expect ${rules.type}, got ${type}`});
        return errors;
      }

      switch (type) {
        case 'string':
          // @ts-expect-error
          if (value.length < rules.min) {
            errors.push({
              field,
              // @ts-expect-error
              error: `too short, expect ${rules.min}, got ${value.length}`,
            });
          }
          // @ts-expect-error
          if (value.length > rules.max) {
            errors.push({
              field,
              // @ts-expect-error
              error: `too long, expect ${rules.max}, got ${value.length}`,
            });
          }
          break;
        case 'number':
          if (value < rules.min) {
            errors.push({
              field,
              error: `too little, expect ${rules.min}, got ${value}`,
            });
          }
          if (value > rules.max) {
            errors.push({
              field,
              error: `too big, expect ${rules.max}, got ${value}`,
            });
          }
          break;
      }
    }

    return errors;
  }
}
