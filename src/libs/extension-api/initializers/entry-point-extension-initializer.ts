import type { ManifestEntryPoint } from '../types/index.js';
import { hasInitExport, loadManifestPlainJs } from '../functions/index.js';
import type { UmbExtensionRegistry } from '../registry/extension.registry.js';
import { UmbExtensionInitializerBase } from './extension-initializer-base.js';
import type { UmbElement } from '@umbraco-cms/backoffice/element-api';

/**
 * Extension initializer for the `entryPoint` extension type
 */
export class UmbEntryPointExtensionInitializer extends UmbExtensionInitializerBase<'entryPoint', ManifestEntryPoint> {
	constructor(host: UmbElement, extensionRegistry: UmbExtensionRegistry<ManifestEntryPoint>) {
		super(host, extensionRegistry, 'entryPoint');
	}

	async instantiateExtension(manifest: ManifestEntryPoint) {
		if (manifest.js) {
			const js = await loadManifestPlainJs(manifest.js);

			// If the extension has known exports, be sure to run those
			if (hasInitExport(js)) {
				js.onInit(this.host, this.extensionRegistry);
			}
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	unloadExtension(_manifest: ManifestEntryPoint): void {
		// No-op
		// Entry points are not unloaded, but if they were, this is where you would do it.
	}
}
