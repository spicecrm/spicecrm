import {Injectable, EventEmitter} from '@angular/core';
import {modelutilities} from './modelutilities.service';

@Injectable()
export class toast {

    activeToasts: Array<any> = [];

    constructor(private modelutilities: modelutilities) {

    }

    public sendToast(text: string, type: string = 'default', description: string = '', autoClose: boolean | number = true ): void {
        if ( autoClose === true ) autoClose = 5; // 5 seconds is standard
        let messageid = this.modelutilities.generateGuid();
        this.activeToasts.push({
            id: messageid,
            type: type,
            theme: 'toast',
            text: text,
            description: description
        });

        // set a timeout to automatically clear the toast
        if (autoClose)
            window.setTimeout(() => this.clearToast(messageid), autoClose*1000 );
    }

    public sendAlert(text: string, type: string = 'default', description: string = '', autoClose: boolean | number = true ): void {
        if ( autoClose === true ) autoClose = 5; // 5 seconds is standard
        let messageid = this.modelutilities.generateGuid();
        this.activeToasts.push({
            id: messageid,
            type: type,
            theme: 'alert',
            text: text,
            description: description
        });

        // set a timeout to automatically clear the toast
        if (autoClose)
            window.setTimeout(() => this.clearToast(messageid), autoClose*1000 );
    }

    clearToast(messageid) {
        this.activeToasts.some((item, index) => {
            if (item.id === messageid) {
                this.activeToasts.splice(index, 1);
                return true;
            }
        })
    }

    clearAll(){
        this.activeToasts = [];
    }

}
