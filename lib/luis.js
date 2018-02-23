const got = require('got');
const util = require('util');

module.exports = (initData) => {
  const appId = initData.appId;
  const appKey = initData.appKey;
  const verbose = initData.verbose;
  const LUISPredictMask = '/luis/v2.0/apps/%s?subscription-key=%s&q=%s&verbose=%s';
  const LUISVerbose = verbose ? 'true' : 'false';
  return {
    predict(txt) {
      const uri = 'https://westus.api.cognitive.microsoft.com'.concat(util.format(LUISPredictMask, appId, appKey, encodeURIComponent(txt), LUISVerbose));
      return got(uri, { json: true });
    },
  };
};
