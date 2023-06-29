import i4kFindSearch from "./i4k-find-search.js";
import i4kFindQuery from "./i4k-find-query.js";
import i4kFindSync from "./i4k-find-sync.js";
import i4kFindInfo from "./i4k-find-info.js";
import i4kFindLogo from "./i4k-find-logo.js";
import i4kFindAnalytics from "./i4k-find-analytics.js";
import i4kFindApp from "./i4k-find-app.js";

const componentDefinitions = {
	"i4k-find-search": i4kFindSearch,
	"i4k-find-query": i4kFindQuery,
	"i4k-find-sync": i4kFindSync,
	"i4k-find-info": i4kFindInfo,
	"i4k-find-logo": i4kFindLogo,
	"i4k-find-analytics": i4kFindAnalytics,
	"i4k-find-app": i4kFindApp,
};

export function defineComponents(components = []) {
	if (components.length === 0) {
		components = [...Object.keys(componentDefinitions)];
	}
	for (const [componentName, componentClass] of Object.entries(
		componentDefinitions
	)) {
		if (
			!customElements.get(componentName) &&
			components.includes(componentName)
		) {
			customElements.define(componentName, componentClass);
		}
	}
}

defineComponents();

export default componentDefinitions;
