import type { Plugin } from "rollup";

const DEFAULT_REMOVED_PROPERTIES = ["scripts", "devDependencies"];
const DEFAULT_INCLUDED_DEPS = ["dependencies", "peerDependencies"];
const DEFAULT_INPUT_PKG_JSON_PATH = "package.json";
const DEFAULT_OUTPUT_PKG_JSON_PATH = "package.json";

export function allowUnlistedExternal({
  packageName,
}: {
  packageName: string;
}): boolean {
  if (packageName.startsWith("node:")) return true;
  return false;
}

export default function pkg(): Plugin {
  const pkgJsonPath = DEFAULT_INPUT_PKG_JSON_PATH;
  const removedProps = DEFAULT_REMOVED_PROPERTIES;
  const includedDeps = DEFAULT_INCLUDED_DEPS;
  const outFileName = DEFAULT_OUTPUT_PKG_JSON_PATH;
  return {
    name: "generate-package-json",
    async buildStart() {
      const originalSource = await this.fs.readFile(pkgJsonPath, {
        encoding: "utf8",
      });
      const original = JSON.parse(originalSource);

      if (typeof original !== "object" || original === null) {
        this.error(`${pkgJsonPath} is not an object`);
      }

      for (const prop of removedProps) {
        delete original[prop];
      }

      this.emitFile({
        type: "prebuilt-chunk",
        fileName: outFileName,
        code: JSON.stringify(original, null, 2),
      });
    },
    async generateBundle(_options, bundle) {
      const pkgOut = bundle[outFileName];
      if (pkgOut.type !== "chunk")
        return this.error(`Unexpect package.json output type ${pkgOut.type}`);

      const pkg = JSON.parse(pkgOut.code);

      interface ImportedBy {
        importPath: string;
        importedBy: string;
      }
      const pkgIncludedDeps = new Map<
        string,
        | { type: "listed"; used: boolean }
        | {
            type: "unlisted";
            importedBy: ImportedBy[];
          }
        | { type: "allowed-unlisted" }
      >(
        includedDeps
          .values()
          .flatMap((k) => Object.keys(pkg[k] || {}).values())
          .map((pkgName) => [pkgName, { type: "listed", used: false }])
      );

      for (const [, chunk] of Object.entries(bundle)) {
        if (chunk.type === "chunk") {
          const allImports = [chunk.imports, chunk.dynamicImports]
            .values()
            .flatMap((imps) => imps.values());

          for (const imported of allImports) {
            if (!(imported in bundle)) {
              const importedPkgName = importPathToPackage(imported);
              let importedPkg = pkgIncludedDeps.get(importedPkgName);
              if (!importedPkg) {
                importedPkg = allowUnlistedExternal({
                  packageName: importedPkgName,
                })
                  ? { type: "allowed-unlisted" }
                  : { type: "unlisted", importedBy: [] };
                pkgIncludedDeps.set(importedPkgName, importedPkg);
              }

              if (importedPkg.type === "unlisted") {
                importedPkg.importedBy.push({
                  importPath: imported,
                  importedBy: chunk.fileName,
                });
              } else if (importedPkg.type === "listed") {
                importedPkg.used = true;
              }
            }
          }
        }
      }

      const { unused, unlisted } = pkgIncludedDeps.entries().reduce<{
        unused: string[];
        unlisted: { name: string; importedBy: ImportedBy[] }[];
      }>(
        (prev, [name, pkgInfo]) => {
          if (pkgInfo.type === "unlisted") {
            prev.unlisted.push({ name, importedBy: pkgInfo.importedBy });
          } else if (pkgInfo.type === "listed" && !pkgInfo.used) {
            prev.unused.push(name);
          }
          return prev;
        },
        { unused: [], unlisted: [] }
      );

      for (const unusedDep of unused) {
        this.warn(`Dependency ${unusedDep} is not used`);
      }

      if (unlisted.length > 0) {
        this.error(
          unlisted
            .map(
              ({ name, importedBy }) =>
                `Dependency ${name} is unlisted, imported by ${importedBy
                  .map((i) => `${i.importedBy} (import "${i.importPath}")`)
                  .join(", ")}`
            )
            .join("\n")
        );
      }
    },
  };
}

function importPathToPackage(imported: string): string {
  const paths = imported.split("/", 2);
  let pkg: string;
  if (paths.length === 2 && paths[0].startsWith("@")) {
    pkg = `${paths[0]}/${paths[1]}`;
  } else {
    pkg = paths[0];
  }

  return pkg;
}
