import { UmbNotificationHandler } from './notification-handler.js';
import { UmbContextToken } from '@umbraco-cms/backoffice/context-api';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UmbContextBase } from '@umbraco-cms/backoffice/class-api';
import { UmbArrayState, UmbBasicState } from '@umbraco-cms/backoffice/observable-api';
import { type TemplateResult, html } from '@umbraco-cms/backoffice/external/lit';

/**
 * The default data of notifications
 * @export
 * @interface UmbNotificationDefaultData
 */
export interface UmbNotificationDefaultData {
	message: string | TemplateResult;
	headline?: string | TemplateResult;
}

/**
 * @export
 * @interface UmbNotificationOptions
 * @template UmbNotificationData
 */
export interface UmbNotificationOptions<UmbNotificationData = UmbNotificationDefaultData> {
	color?: UmbNotificationColor;
	duration?: number | null;
	elementName?: string;
	data?: UmbNotificationData;
}

export interface UmbNotificationFragment extends Omit<UmbNotificationOptions, 'duration' | 'elementName'> {}
export interface UmbNotificationCategoryFragment extends UmbNotificationFragment {
	category: string;
}

export type UmbNotificationColor = '' | 'default' | 'positive' | 'warning' | 'danger';

export class UmbNotificationContext extends UmbContextBase<UmbNotificationContext> {
	// Notice this cannot use UniqueBehaviorSubject as it holds a HTML Element. which cannot be Serialized to JSON (it has some circular references)
	private _notifications = new UmbBasicState(<Array<UmbNotificationHandler>>[]);
	public readonly notifications = this._notifications.asObservable();

	#fragments = new UmbArrayState<UmbNotificationCategoryFragment>([], (x) => x);
	public readonly fragments = this.#fragments.asObservable();

	constructor(host: UmbControllerHost) {
		super(host, UMB_NOTIFICATION_CONTEXT);
	}

	/**
	 * @private
	 * @param {UmbNotificationOptions<UmbNotificationData>} options
	 * @return {*}  {UmbNotificationHandler}
	 * @memberof UmbNotificationContext
	 */
	private _open(options: UmbNotificationOptions): UmbNotificationHandler {
		const notificationHandler = new UmbNotificationHandler(options);
		notificationHandler.element.addEventListener('closed', () => this._handleClosed(notificationHandler));

		this._notifications.setValue([...this._notifications.getValue(), notificationHandler]);

		return notificationHandler;
	}

	/**
	 * @private
	 * @param {string} key
	 * @memberof UmbNotificationContext
	 */
	private _close(key: string) {
		this._notifications.setValue(this._notifications.getValue().filter((notification) => notification.key !== key));
	}

	/**
	 * @private
	 * @param {string} key
	 * @memberof UmbNotificationContext
	 */
	private _handleClosed(notificationHandler: UmbNotificationHandler) {
		notificationHandler.element.removeEventListener('closed', () => this._handleClosed(notificationHandler));
		this._close(notificationHandler.key);
	}

	/**
	 * Appends a notification fragment to a category that can be opened later.
	 * @param {UmbNotificationColor} color
	 * @param {UmbNotificationFragment} fragment
	 * @param {string} category
	 * @return {*}
	 * @memberof UmbNotificationContext
	 */
	public append(color: UmbNotificationColor, fragment: UmbNotificationFragment, category: string) {
		this.#fragments.appendOne({ color, ...fragment, category });
	}

	/**
	 * Get data of all unopened notifications, or those in the specified category if provided.
	 * @return {*}
	 * @param {string} category (optional)
	 * @memberof UmbNotificationContext
	 */
	public getAvailableFragments(category?: string) {
		if (category) {
			return this.#fragments.getValue().filter((frag) => frag.category === category);
		} else {
			return this.#fragments.getValue();
		}
	}

	/**
	 * Opens a compilation of a category of fragments that are combined by color. If there is fragments of different color in the same category, opens a notification for each color.
	 * @param {string} category the category to compile and open
	 * @param {string} override override the compiled data. If color is overridden, it forces all fragments of the chosen category to appear in the given color. (optional)
	 * @return {*}
	 * @memberof UmbNotificationContext
	 */
	public peekCompilation(category: string, override?: UmbNotificationOptions) {
		const fragments = this.#fragments.getValue().filter((frag) => frag.category === category);
		if (!fragments.length) return; // No fragments found in category.

		const notificationCompilations: Array<UmbNotificationOptions> = [];

		// Compile fragments
		fragments.forEach((fragment) => {
			const color = override?.color || fragment.color;
			let message = override?.data?.message || fragment.data?.message || '';
			let headline = override?.data?.message || fragment.data?.headline || '';

			const index = notificationCompilations.findIndex((notification) => notification.color === color);

			if (index !== -1) {
				// Compile fragments of the same color.
				const compiled = notificationCompilations[index];

				if (!override?.data?.headline) {
					headline = compiled.data?.headline ? html`${compiled.data.headline}<br />${headline}` : headline;
				}

				if (!override?.data?.message) {
					message = compiled.data?.message ? html`${compiled.data.message}<br />${message}` : message;
				}

				notificationCompilations[index] = { ...compiled, data: { message, headline } };
			} else {
				// Add fragment to compilation.
				notificationCompilations.push({ color, data: { message, headline } });
			}

			this.#fragments.removeOne(fragment);
		});

		notificationCompilations.forEach((notification) =>
			this.peek(notification.color!, {
				...notification,
				elementName: override?.elementName,
				duration: override?.duration,
			}),
		);
	}

	/**
	 * Removes all unopened notifications from the specified category.
	 * @param {string} category
	 * @return {*}
	 * @memberof UmbNotificationContext
	 */
	public removeCategory(category: string) {
		this.#fragments.filter((frag) => frag.category !== category);
	}

	/**
	 * Opens a notification that automatically goes away after 6 sek.
	 * @param {UmbNotificationColor} color
	 * @param {UmbNotificationOptions<UmbNotificationData>} options
	 * @return {*}
	 * @memberof UmbNotificationContext
	 */
	public peek(color: UmbNotificationColor, options: UmbNotificationOptions): UmbNotificationHandler {
		return this._open({ color, ...options });
	}

	/**
	 * Opens a notification that stays on the screen until dismissed by the user or custom code
	 * @param {UmbNotificationColor} color
	 * @param {UmbNotificationOptions<UmbNotificationData>} options
	 * @return {*}
	 * @memberof UmbNotificationContext
	 */
	public stay(color: UmbNotificationColor, options: UmbNotificationOptions): UmbNotificationHandler {
		return this._open({ ...options, color, duration: null });
	}
}

export const UMB_NOTIFICATION_CONTEXT = new UmbContextToken<UmbNotificationContext>('UmbNotificationContext');
