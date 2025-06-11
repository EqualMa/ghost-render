export default class DependenciesUsed {
  #deps: Map<string, boolean>;
  constructor(deps: Iterable<string>) {
    this.#deps = new Map(Iterator.from(deps).map((dep) => [dep, false]));
  }

  markAsUsed(dep: string): this {
    if (!this.#deps.has(dep)) {
      throw new Error(`unknown dependency ${dep} cannot be marked as used`);
    }
    this.#deps.set(dep, true);
    return this;
  }

  testAndMarkAsUsed(source: string): boolean {
    if (this.#deps.has(source)) {
      this.#deps.set(source, true);
      return true;
    }

    for (const dep of this.#deps.keys()) {
      if (source.startsWith(`${dep}/`)) {
        this.#deps.set(dep, true);
        return true;
      }
    }

    return false;
  }

  unusedDeps(): string[] {
    return this.#deps
      .entries()
      .filter(([, v]) => !v)
      .map(([k]) => k)
      .toArray();
  }
}
