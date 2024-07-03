import type { UmbDataTypeEntityType } from '../../entity.js';

export interface UmbDataTypeItemModel {
	entityType: UmbDataTypeEntityType;
	unique: string;
	name: string;
	propertyEditorUiAlias: string;
	icon?: string;
}
