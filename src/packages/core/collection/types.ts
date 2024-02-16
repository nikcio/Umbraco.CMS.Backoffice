import type { ManifestCollection } from '@umbraco-cms/backoffice/extension-registry';
import type { Observable } from '@umbraco-cms/backoffice/external/rxjs';
import type { UmbPaginationManager } from '@umbraco-cms/backoffice/utils';

export interface UmbCollectionBulkActionPermissions {
	allowBulkCopy: boolean;
	allowBulkDelete: boolean;
	allowBulkMove: boolean;
	allowBulkPublish: boolean;
	allowBulkUnpublish: boolean;
}

export interface UmbCollectionConfiguration {
	allowedEntityBulkActions?: UmbCollectionBulkActionPermissions;
	includeProperties?: Array<any>;
	orderBy?: string;
	orderDirection?: string;
	pageSize?: number;
	useInfiniteEditor?: boolean;
}

export interface UmbCollectionContext {
	setConfig(config: UmbCollectionConfiguration): void;
	getConfig(): UmbCollectionConfiguration | undefined;
	setManifest(manifest: ManifestCollection): void;
	getManifest(): ManifestCollection | undefined;
	requestCollection(): Promise<void>;
	pagination: UmbPaginationManager;
	items: Observable<any[]>;
	totalItems: Observable<number>;
}
