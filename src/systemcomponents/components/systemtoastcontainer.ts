/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module SystemComponents
 */
import {ChangeDetectorRef, Component, Renderer2} from '@angular/core';
import {toast} from '../../services/toast.service';
import {layout} from '../../services/layout.service';

@Component({
    selector: 'system-toast-container',
    templateUrl: './src/systemcomponents/templates/systemtoastcontainer.html'
})
export class SystemToastContainer {

    constructor(private toast: toast, private layout: layout, private renderer: Renderer2, private cdr: ChangeDetectorRef) {
        this.renderer.listen('window', 'resize', () => this.cdr.detectChanges());

    }

    get isnarrow() {
        return this.layout.screenwidth == 'small';
    }

    get toastStyle() {
        return this.isnarrow ? {'min-width': 'unset', 'border-radius': 0, 'border-bottom': '1px solid #fff'} : {};
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

        return this.isnarrow ? toastclass + ' slds-size--1-of-1 slds-m-around--none' : toastclass;
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