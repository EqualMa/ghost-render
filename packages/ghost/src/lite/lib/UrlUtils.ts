import type { DependenciesUrlUtils } from "ghost/core/server/services/email-service/EmailRenderer";

/** Initialization method to pass in URL configurations */
export interface UrlUtilsOptions {
  getSubdir: () => string;
  getSiteUrl: () => string;
  /** static prefix for serving images. Should not be passed in, unless customizing ghost instance image storage */
  staticImageUrlPrefix?: string;
}

export default class UrlUtils implements DependenciesUrlUtils {
  #_config: { staticImageUrlPrefix: string };
  #getSubdir: UrlUtilsOptions["getSubdir"];
  #getSiteUrl: UrlUtilsOptions["getSiteUrl"];

  constructor(options: UrlUtilsOptions) {
    this.#_config = {
      staticImageUrlPrefix: options.staticImageUrlPrefix ?? "content/images",
    };

    this.#getSubdir = options.getSubdir;
    this.#getSiteUrl = options.getSiteUrl;
  }

  // ## createUrl
  // Simple url creation from a given path
  // Ensures that our urls contain the subdirectory if there is one
  // And are correctly formatted as either relative or absolute
  // Usage:
  // createUrl('/', true) -> http://my-ghost-blog.com/
  // E.g. /blog/ subdir
  // createUrl('/welcome-to-ghost/') -> /blog/welcome-to-ghost/
  // Parameters:
  // - urlPath - string which must start and end with a slash
  // - absolute (optional, default:false) - boolean whether or not the url should be absolute
  // Returns:
  //  - a URL which always ends with a slash
  createUrl(urlPath = "/", absolute = false, trailingSlash = false): string {
    let base;

    // create base of url, always ends without a slash
    if (absolute) {
      base = this.#getSiteUrl();
    } else {
      base = this.#getSubdir();
    }

    if (trailingSlash) {
      if (!urlPath.match(/\/$/)) {
        urlPath += "/";
      }
    }

    if (absolute) {
      return new URL(urlPath, base).href;
    } else {
      return `${base}${base.endsWith("/") ? "" : "/"}${urlPath}`;
    }
  }

  urlFor(
    ...[context, _data, _absolute]: Parameters<DependenciesUrlUtils["urlFor"]>
  ) {
    let data: true | { image: string; trailingSlash?: undefined } | null =
      _data;
    let absolute: boolean | undefined = _absolute;
    let urlPath = "/";
    let imagePathRe;
    let baseUrl;

    // Make data properly optional
    if (typeof data === "boolean") {
      absolute = data;
      data = null;
    }

    if (context === "image" && data?.image) {
      urlPath = data.image;
      imagePathRe = new RegExp(
        "^" + this.#getSubdir() + "/" + this.#_config.staticImageUrlPrefix
      );
      absolute = imagePathRe.test(data.image) ? absolute : false;

      if (absolute) {
        // Remove the sub-directory from the URL because ghostConfig will add it back.
        urlPath = urlPath.replace(new RegExp("^" + this.#getSubdir()), "");
        baseUrl = this.#getSiteUrl().replace(/\/$/, "");
        urlPath = baseUrl + urlPath;
      }

      return urlPath;
    } else if (context === "home" && absolute) {
      urlPath = this.#getSiteUrl();

      // CASE: there are cases where urlFor('home') needs to be returned without trailing
      // slash e. g. the `{{@site.url}}` helper. See https://github.com/TryGhost/Ghost/issues/8569
      if (data && data.trailingSlash === false) {
        urlPath = urlPath.replace(/\/$/, "");
      }
    } else {
      const err = new Error(`urlFor unimplemented`);
      (err as { args?: unknown }).args = { context, data, absolute };
      throw err;
    }

    // This url already has a protocol so is likely an external url to be returned
    // or it is an alternative scheme, protocol-less, or an anchor-only path
    if (
      urlPath &&
      (urlPath.indexOf("://") !== -1 ||
        urlPath.match(/^(\/\/|#|[a-zA-Z0-9-]+:)/))
    ) {
      return urlPath;
    }

    return this.createUrl(urlPath, absolute);
  }

  /**
   * Return whether the provided URL is part of the site (checks if same domain and within subdirectory)
   * @param context describing the context for which you need to check a url
   */
  isSiteUrl(url: URL, context: "home" = "home"): boolean {
    const siteUrl = new URL(this.urlFor(context, true));
    if (siteUrl.host === url.host) {
      if (url.pathname.startsWith(siteUrl.pathname)) {
        return true;
      }
      return false;
    }
    return false;
  }
}
