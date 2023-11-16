import { UmbContextToken } from '@umbraco-cms/backoffice/context-api';
import { UmbArrayState } from '@umbraco-cms/backoffice/observable-api';
import { UmbStoreBase } from '@umbraco-cms/backoffice/store';
import type { TemplateResponseModel } from '@umbraco-cms/backoffice/backend-api';
import { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller-api';

/**
 * @export
 * @class UmbPartialViewStore
 * @extends {UmbStoreBase}
 * @description - Data Store for partial views
 */
export class UmbPartialViewStore extends UmbStoreBase {
	/**
	 * Creates an instance of UmbPartialViewStore.
	 * @param {UmbControllerHostInterface} host
	 * @memberof UmbPartialViewStore
	 */
	constructor(host: UmbControllerHostElement) {
		super(host, UMB_PARTIAL_VIEW_STORE_CONTEXT.toString(), new UmbArrayState<TemplateResponseModel>([], (x) => x.id));
	}
}

export const UMB_PARTIAL_VIEW_STORE_CONTEXT = new UmbContextToken<UmbPartialViewStore>('UmbPartialViewStore');
