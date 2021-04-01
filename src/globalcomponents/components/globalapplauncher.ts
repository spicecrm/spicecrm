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
 * @module GlobalComponents
 */
import {
    Component
} from '@angular/core';
import {Router} from "@angular/router";
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {modal} from '../../services/modal.service';

/**
 * renders the app launcher icon and the name of the curent active role. If pressed the app launcher dialog is rendered as modal
 */
@Component({
    selector: 'global-app-launcher',
    templateUrl: './src/globalcomponents/templates/globalapplauncher.html',
    host: {
        class: 'slds-context-bar__primary slds-context-bar__item--divider-right'
    }
})
export class GlobalAppLauncher {

    constructor(private metadata: metadata, private modal: modal, private language: language, private router: Router) {

    }

    /**
     * a getter for the name of the active role in the selected language
     */
    get roleName() {
        let role = this.metadata.getActiveRole();
        if (role.label && role.label != '') {
            return this.language.getLabel(role.label);
        } else {
            return this.metadata.getActiveRole().name;
        }
    }

    /**
     * linked to the app launcher button ion the template and will render the app launcher dialog
     */
    private showAppLauncher() {
        this.modal.openModal('GlobalAppLauncherDialog');
    }

    private navigateHome(){
        this.router.navigate(['module/Home']);
    }
}
