import {Injectable, EventEmitter} from "@angular/core";
import {modelutilities} from "./modelutilities.service";

@Injectable()
export class toast {

    private activeToasts: Array<any> = [];

    constructor(private modelutilities: modelutilities) {

    }

    public sendToast(text: string, type: string = "default", description: string = "", autoClose: boolean | number = true): void {
        if (autoClose === true) {
            // 5 seconds is standard
            autoClose = 5;
        }
        let messageid = this.modelutilities.generateGuid();
        this.activeToasts.push({
            id: messageid,
            type: type,
            theme: "toast",
            text: text,
            description: description
        });

        // set a timeout to automatically clear the toast
        if (autoClose) {
            window.setTimeout(() => this.clearToast(messageid), autoClose * 1000);
        }
    }

    public sendAlert(text: string, type: string = "default", description: string = "", autoClose: boolean | number = true): void {
        if (autoClose === true) {
            // 5 seconds is standard
            autoClose = 5;
        }
        let messageid = this.modelutilities.generateGuid();
        this.activeToasts.push({
            id: messageid,
            type: type,
            theme: "alert",
            text: text,
            description: description
        });

        // set a timeout to automatically clear the toast
        if (autoClose) {
            window.setTimeout(() => this.clearToast(messageid), autoClose * 1000);
        }
    }

    private clearToast(messageid) {
        this.activeToasts.some((item, index) => {
            if (item.id === messageid) {
                this.activeToasts.splice(index, 1);
                return true;
            }
        });
    }

    public clearAll() {
        this.activeToasts = [];
    }

}
