import { format } from "node:util";

import got from "got";

const luis = (initData) => {
	const { appId, appKey, verbose } = initData;
	const LUISPredictMask = "/luis/v2.0/apps/%s?subscription-key=%s&q=%s&verbose=%s";
	const LUISVerbose = verbose ? "true" : "false";
	return {
		predict(txt) {
			const uri = "https://westus.api.cognitive.microsoft.com"
				.concat(format(LUISPredictMask, appId, appKey, encodeURIComponent(txt), LUISVerbose));
			return got(uri, { responseType: "json" });
		},
	};
};

export default luis;
