/**
 * @module services
 */
import { ApplicationRef, Injectable } from "@angular/core";
import {modelutilities} from "./modelutilities.service";

/**
 * a generic service that handles the toasts. The service is also injected in the footer component that renders the toas on top of the complete UI. In the DOM hierarchy Toasts are high in the index overlyaing all other elements.
 */
@Injectable()
export class toast {

    /**
     * array holding the current active toasts that are rendered in the toast container
     */
    public activeToasts: any[] = [];

    /*  Showing toasts is based on the array "activeToasts" and the angular change detection cares for displaying the toasts.
     *  But sometimes the change detection is not triggered automatically. For example: getAsString() of ClipboardEvent.
     *  Therefore the toast service triggers the change detection manually, with appref.tick().
     */

    constructor(public modelutilities: modelutilities, public appref: ApplicationRef ) { }

    /**
     * a generic function to send a toast
     *
     * @param text the text of the message to be sent
     * @param type the type of toast
     * @param description an optional longtext to be displayed with the toast
     * @param autoClose if set to true the toast will automatically close itself after 5 seconds
     * @param uniqueMessageCode a string that unuqely identifies the type oif a message. If that is sent this ensuires that this type of message is sent to the user only once. This makes e.g. sense if the user is logged off .. then the toast that the user has been logged out might be sent several times. With the unique id this is only sent once to the user
     */
    public sendToast(text: string, type: "default" | "warning" | "info" | "success" | "error" = "default", description: string = "", autoClose: boolean | number = true, uniqueMessageCode?: string): string {
        return this.addToast(text, 'toast', type, description, autoClose, uniqueMessageCode);
    }

    /**
     * a generic function to send an alert. This difers from the regular toast by the texture
     *
     * @param text the text of the message to be sent
     * @param type the type of toast
     * @param description an optional longtext to be displayed with the toast
     * @param autoClose if set to true the toast will automatically close itself after 5 seconds
     * @param uniqueMessageCode a string that unuqely identifies the type oif a message. If that is sent this ensuires that this type of message is sent to the user only once. This makes e.g. sense if the user is logged off .. then the toast that the user has been logged out might be sent several times. With the unique id this is only sent once to the user
     */
    public sendAlert(text: string, type: "default" | "warning" | "info" | "success" | "error" = "default", description: string = "", autoClose: boolean | number = true, uniqueMessageCode?: string): string {
        return this.addToast(text, 'alert', type, description, autoClose, uniqueMessageCode);
    }

    /**
     * the internal funtion handling the toast adding
     *
     * @param text the text of the message to be sent
     * @param theme the theme to be used
     * @param description an optional longtext to be displayed with the toast
     * @param autoClose if set to true the toast will automatically close itself after 5 seconds
     * @param uniqueMessageCode a string that unuqely identifies the type oif a message. If that is sent this ensuires that this type of message is sent to the user only once. This makes e.g. sense if the user is logged off .. then the toast that the user has been logged out might be sent several times. With the unique id this is only sent once to the user
     */
    public addToast(text: string, theme: 'toast' | 'alert' = 'toast', type: "default" | "warning" | "info" | "success" | "error" = "default", description: string = "", autoClose: boolean | number = true, uniqueMessageCode?: string): string {
        // check if a unique message code has been passed in .. if that is the case check if a toast with this unique id is active already
        if (uniqueMessageCode && this.activeToasts.filter(toast => toast.code == uniqueMessageCode).length > 0) {
            return '';
        }

        if (type === 'error') autoClose = false;
        if (autoClose === true) {
            // 5 seconds is standard
            autoClose = 5;
        }
        let messageId = this.modelutilities.generateGuid();
        this.activeToasts.push({
            id: messageId,
            type: type,
            theme: theme,
            text: text,
            description: description,
            code: uniqueMessageCode
        });
        this.appref.tick();

        // set a timeout to automatically clear the toast
        if (autoClose) {
            window.setTimeout(() => this.clearToast(messageId), autoClose * 1000);
        }

        return messageId;
    }

    /**
     * a public function to clear the toast by the unique toast id that is returned when the toast is added
     *
     * @param messageId
     */
    public clearToast(messageId) {
        if (!messageId) return;
        this.activeToasts.some((item, index) => {
            if (item.id === messageId) {
                this.activeToasts.splice(index, 1);
                this.appref.tick();
                return true;
            }
        });
    }

    /**
     * clears all toasts
     */
    public clearAll() {
        this.activeToasts = [];
        this.appref.tick();
    }

}
