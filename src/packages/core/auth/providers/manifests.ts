import type { ManifestAuthProvider } from '@umbraco-cms/backoffice/extension-registry';

export const manifests: Array<ManifestAuthProvider> = [
	{
		type: 'authProvider',
		alias: 'Umb.AuthProviders.Umbraco',
		name: 'Umbraco login provider',
		forProviderName: 'Umbraco',
		weight: 1000,
		element: () => import('./auth-provider-umbraco.element.js'),
		meta: {
			label: 'Umbraco',
		},
	},
];
