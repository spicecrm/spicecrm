/**
 * @module SystemComponents
 */
import {ChangeDetectorRef, Component, Renderer2} from '@angular/core';
import {toast} from '../../services/toast.service';
import {layout} from '../../services/layout.service';

@Component({
    selector: 'system-toast-container',
    templateUrl: '../templates/systemtoastcontainer.html'
})
export class SystemToastContainer {

    constructor(public toast: toast, public layout: layout, public renderer: Renderer2, public cdr: ChangeDetectorRef) {
        this.renderer.listen('window', 'resize', () => this.cdr.detectChanges());

    }

    get isnarrow() {
        return this.layout.screenwidth == 'small';
    }

    get toastStyle() {
        return this.isnarrow ? {'min-width': 'unset', 'border-radius': 0, 'border-bottom': '1px solid #fff'} : {};
    }

    public getToastClass(type, theme) {
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

        return this.isnarrow ? toastclass + ' slds-size--1-of-1 slds-m-around--none' : toastclass;
    }

    public getToastIcon(type) {
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
