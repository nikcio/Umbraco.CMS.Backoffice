const { rest } = window.MockServiceWorker;
import { umbUsersData } from '../../data/user/user.db.js';
import { UMB_SLUG } from './slug.js';
import { umbracoPath } from '@umbraco-cms/backoffice/utils';

export const handlers = [
	rest.post(umbracoPath(`${UMB_SLUG}/set-user-groups`), async (req, res, ctx) => {
		const data = await req.json();
		if (!data) return;

		umbUsersData.setUserGroups(data);

		return res(ctx.status(200));
	}),
];
