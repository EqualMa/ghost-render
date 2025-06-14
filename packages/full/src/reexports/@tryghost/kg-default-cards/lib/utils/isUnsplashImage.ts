import isUnsplashImage from "@tryghost/kg-default-cards/lib/utils/is-unsplash-image.js";
type IsUnsplashImage = (url: string) => boolean;
export default isUnsplashImage satisfies IsUnsplashImage as IsUnsplashImage;
