import DependenciesUsed from "./deps";

export default function makeExternal(options: {
  deps: string[];
  bundledDeps: string[];
}) {
  const deps = new DependenciesUsed(options.deps);
  const bundledDeps = new DependenciesUsed(options.bundledDeps);

  const external = (source: string, importer: string | undefined) => {
    if (source.startsWith("node:")) return true;

    if (deps.testAndMarkAsUsed(source)) return true;
    if (bundledDeps.testAndMarkAsUsed(source)) return false;

    if (
      importer?.includes("/node_modules/ghost/") &&
      source === "nodemailer/lib/addressparser"
    )
      return false;

    if (/^[a-zA-Z@]/.test(source)) {
      throw new Error(`implicit dependency ${source} imported by ${importer}`);
    }

    return false;
  };

  return {
    deps,
    bundledDeps,
    external,
  };
}
