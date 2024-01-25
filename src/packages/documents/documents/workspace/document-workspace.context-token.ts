import { UMB_DOCUMENT_ENTITY_TYPE } from '../entity.js';
import type { UmbDocumentWorkspaceContext } from './document-workspace.context.js';
import { UmbContextToken } from '@umbraco-cms/backoffice/context-api';
import type { UmbSaveableWorkspaceContextInterface } from '@umbraco-cms/backoffice/workspace';

export const UMB_DOCUMENT_WORKSPACE_CONTEXT = new UmbContextToken<
	UmbSaveableWorkspaceContextInterface,
	UmbDocumentWorkspaceContext
>(
	'UmbWorkspaceContext',
	undefined,
	(context): context is UmbDocumentWorkspaceContext => context.getEntityType?.() === UMB_DOCUMENT_ENTITY_TYPE,
);
