function sum(a: number, b: number) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError();
  }

  return a + b;
}

export default sum;
