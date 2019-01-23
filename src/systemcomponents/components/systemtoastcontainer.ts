import {Component, OnInit} from '@angular/core';
import {toast} from '../../services/toast.service';
import {layout} from '../../services/layout.service';

@Component({
    selector: 'system-toast-container',
    templateUrl: './src/systemcomponents/templates/systemtoastcontainer.html'
})
export class SystemToastContainer {

    constructor(private toast: toast, private layout: layout) {
    }

    get isnarrow() {
        return this.layout.screenwidth == 'small';
    }

    private getToastClass(type, theme) {
        let toastclass = '';
        switch (theme) {
            case 'alert':
                toastclass = 'slds-notify--alert slds-theme--alert-texture ';
                break;
            default:
                toastclass = 'slds-notify--toast ';
                break;
        }

        switch (type) {
            case 'success':
                toastclass += 'slds-theme--success';
                break;
            case 'warning':
                toastclass += 'slds-theme--warning';
                break;
            case 'error':
                toastclass += 'slds-theme--error';
                break;
        }
        return toastclass;
    }

    private getToastIcon(type) {
        switch (type) {
            case 'success':
                return 'success';
            case 'warning':
                return 'warning';
            case 'error':
                return 'error';
            default:
                return 'info';
        }
    }
}