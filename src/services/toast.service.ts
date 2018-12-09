import {Injectable, EventEmitter} from "@angular/core";
import {modelutilities} from "./modelutilities.service";

@Injectable()
export class toast {

    private activeToasts: Array<any> = [];

    constructor(private modelutilities: modelutilities) {

    }

    public sendToast( text: string, type: "default"|"warning"|"info"|"success"|"error" = "default", description: string = "", autoClose: boolean | number = true): string {
        if ( type === 'error' ) autoClose = false;
        if (autoClose === true) {
            // 5 seconds is standard
            autoClose = 5;
        }
        let messageId = this.modelutilities.generateGuid();
        this.activeToasts.push({
            id: messageId,
            type: type,
            theme: "toast",
            text: text,
            description: description
        });

        // set a timeout to automatically clear the toast
        if (autoClose) {
            window.setTimeout(() => this.clearToast(messageId), autoClose * 1000);
        }

        return messageId;
    }

    public sendAlert(text: string, type: string = "default", description: string = "", autoClose: boolean | number = true): string {
        if (autoClose === true) {
            // 5 seconds is standard
            autoClose = 5;
        }
        let messageId = this.modelutilities.generateGuid();
        this.activeToasts.push({
            id: messageId,
            type: type,
            theme: "alert",
            text: text,
            description: description
        });

        // set a timeout to automatically clear the toast
        if (autoClose) {
            window.setTimeout(() => this.clearToast(messageId), autoClose * 1000);
        }

        return messageId;
    }

    public clearToast( messageId ) {
        if ( !messageId ) return;
        this.activeToasts.some((item, index) => {
            if ( item.id === messageId ) {
                this.activeToasts.splice(index, 1);
                return true;
            }
        });
    }

    public clearAll() {
        this.activeToasts = [];
    }

}
