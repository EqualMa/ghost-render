export default function makeFields<Defs extends object, T>(fieldDefs: {
  [K in keyof Defs]: (data: T) => Defs[K];
}) {
  class Fields {
    #data: T;

    constructor(data: T) {
      this.#data = data;
    }

    __data(): T {
      return this.#data;
    }

    get<K extends keyof Defs>(key: K): Defs[K] {
      const fieldDef = fieldDefs[key];
      if (!fieldDef) {
        throw new Error(
          `${this.constructor.name} doesn't have field ${String(key)}`
        );
      }

      return fieldDef(this.#data);
    }
  }

  return Fields;
}
