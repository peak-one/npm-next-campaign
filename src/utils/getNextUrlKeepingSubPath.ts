function fixCurrentUrlExtraSlashs() {
  return location.pathname.replace(/\/+/g, "/").replace(/\/+$/, "");
}

/**
 * 
 * @param nextURL given the nextURL, it returns the next URL keeping the subpath
 * @example getNextUrlKeepingSubPath("/upsell1") // returns "https://example.com/v1/upsell1" keeping the subpath "/v1", if there is no subpath it will return "https://example.com/upsell1"
 */
function getNextUrlKeepingSubPath(nextURL: string) {
  const pathNoExtraSlashs = fixCurrentUrlExtraSlashs().split('/');
  const cleanPath = pathNoExtraSlashs.filter((pathString) => pathString !== "");
  cleanPath.pop();   // removed "end of URL" to replace later by "nextURL"
  let campaignPath = cleanPath.join("/");
  const rootPathLength = 0;
  if (cleanPath.length <= rootPathLength) {
      campaignPath = fixCurrentUrlExtraSlashs();
  }
  const base = location.protocol + '//' + location.host;
  const url = new URL(campaignPath + nextURL + '/', base);
  return url.href;
};

export default getNextUrlKeepingSubPath;