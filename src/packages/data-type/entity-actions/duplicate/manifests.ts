import { UMB_DATA_TYPE_ENTITY_TYPE } from '../../entity.js';
import { UMB_DATA_TYPE_TREE_ALIAS, UMB_DATA_TYPE_TREE_REPOSITORY_ALIAS } from '../../tree/index.js';
import { UMB_DUPLICATE_DATA_TYPE_REPOSITORY_ALIAS } from './repository/index.js';
import { manifests as repositoryManifests } from './repository/manifests.js';
import type { ManifestTypes } from '@umbraco-cms/backoffice/extension-registry';

const entityActions: Array<ManifestTypes> = [
	{
		type: 'entityAction',
		kind: 'duplicateTo',
		alias: 'Umb.EntityAction.DataType.DuplicateTo',
		name: 'Duplicate Document To Entity Action',
		forEntityTypes: [UMB_DATA_TYPE_ENTITY_TYPE],
		meta: {
			duplicateRepositoryAlias: UMB_DUPLICATE_DATA_TYPE_REPOSITORY_ALIAS,
			treeAlias: UMB_DATA_TYPE_TREE_ALIAS,
			treeRepositoryAlias: UMB_DATA_TYPE_TREE_REPOSITORY_ALIAS,
			foldersOnly: true,
		},
	},
];

export const manifests: Array<ManifestTypes> = [...entityActions, ...repositoryManifests];
