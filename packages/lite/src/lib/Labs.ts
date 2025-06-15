import type {
  DependenciesLabs,
  DependenciesLabsKnownKey,
} from "@ghost-render/email-renderer";

export type LabsObject = { [_ in DependenciesLabsKnownKey]?: boolean };

const DEFAULTS: Record<string, boolean | undefined> = {
  i18n: true,
  contentVisibility: true,
  emailCustomization: false,
  emailCustomizationAlpha: false,
} satisfies Record<DependenciesLabsKnownKey, boolean>;

export default class Labs implements DependenciesLabs {
  #values: LabsObject | undefined;
  constructor(values?: LabsObject) {
    this.#values = values;
  }

  isSet(k: DependenciesLabsKnownKey | (string & {})): boolean {
    const v = this.#values?.[k as DependenciesLabsKnownKey] ?? DEFAULTS[k];
    if (v === undefined) throw new Error(`unknown lab feature key ${k}`);
    if (typeof v !== "boolean")
      throw new Error(
        `the type of lab feature ${k} is not boolean but ${typeof v}`
      );
    return v;
  }
}
