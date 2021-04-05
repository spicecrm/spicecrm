/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
     * array holding the current active toasts that are rendered in the toas container
     */
    private activeToasts: any[] = [];

    /*  Showing toasts is based on the array "activeToasts" and the angular change detection cares for displaying the toasts.
     *  But sometimes the change detection is not triggered automatically. For example: getAsString() of ClipboardEvent.
     *  Therefore the toast service triggers the change detection manually, with appref.tick().
     */

    constructor(private modelutilities: modelutilities, private appref: ApplicationRef ) { }

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
    private addToast(text: string, theme: 'toast' | 'alert' = 'toast', type: "default" | "warning" | "info" | "success" | "error" = "default", description: string = "", autoClose: boolean | number = true, uniqueMessageCode?: string): string {
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
