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
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {broadcast} from '../../services/broadcast.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';

/**
 * the app launcher dialog that renders the users roles and also the users modules. Allows filering and navigating to a specific module/application
 */
@Component({
    selector: 'global-app-launcher-dialog',
    templateUrl: './src/globalcomponents/templates/globalapplauncherdialog.html'
})
export class GlobalAppLauncherDialog {

    /**
     * @ignore
     */
    private searchTerm: string = '';
    /**
     * @ignore
     */
    public self: any = undefined;

    constructor(
        private metadata: metadata,
        private language: language,
        private router: Router,
        private broadcast: broadcast
    ) {
    }

    /**
     * a gett that returns true if the user can choose roles
     */
    get showRoles() {
        return this.metadata.getRoles().length > 1;
    }

    /**
     * closes the modal window and destroys the component
     */
    private close() {
        this.self.destroy();
    }


    /**
     * fecthes the available roles for the user
     */
    private getRoles() {
        return this.metadata.getRoles();
    }

    /**
     * set the chosen role and closes the app launcher
     *
     * @param roleid the selected roleid
     */
    private setRole(roleid) {
        this.metadata.setActiveRole(roleid);

        // navigate home and broadcast the message
        this.broadcast.broadcastMessage('applauncher.setrole', roleid);

        // close the launcher dialog
        this.close();
    }

    /**
     * gets the modules from the metadata service and returns them for rendering in the modal
     */
    private getModules() {
        let menuItems = [];

        for (let module of this.metadata.getModules()) {
            let moduleData = this.metadata.getModuleDefs(module);
            if (moduleData.visible && (!moduleData.visibleaclaction || (moduleData.visibleaclaction && this.metadata.checkModuleAcl(module, moduleData.visibleaclaction))) && this.metadata.checkModuleAcl(module, 'list') && (this.searchTerm === '' || (this.searchTerm !== '' && this.language.getModuleName(module) && this.language.getModuleName(module).toLowerCase().indexOf(this.searchTerm.toLowerCase()) >= 0))) {
                menuItems.push(module);
            }
        }

        menuItems.sort((a, b) => {
            return this.language.getModuleName(a) > this.language.getModuleName(b) ? 1 : -1;
        });
        return menuItems;
    }

    /**
     * navigates to the slected module and closes the app launcher dialog
     *
     * @param module the module to navigate to
     */
    private gotoModule(module) {
        this.router.navigate(['/module/' + module]);
        this.close();
    }
}
