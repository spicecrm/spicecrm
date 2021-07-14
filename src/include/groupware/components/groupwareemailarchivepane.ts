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
 * @module ModuleGroupware
 */
import {Component, OnInit} from '@angular/core';
import {GroupwareService} from '../../../include/groupware/services/groupware.service';
import {metadata} from "../../../services/metadata.service";
import {view} from "../../../services/view.service";

/**
 * A groupware container for the tabs and their content.
 * Those include: beans list, search pane, attachment list, linked bean list.
 */
@Component({
    selector: 'groupware-email-archive-pane',
    templateUrl: './src/include/groupware/templates/groupwareemailarchivepane.html',
    providers: [view]
})
export class GroupwareEmailArchivePane implements OnInit {
    /**
     * Currently active tab.
     */
    private activetab: number = 0;

    /**
     * the component config
     */
    public componentconfig: any;

    constructor(
        private metadata: metadata,
        private view: view,
        private groupware: GroupwareService,
    ) {
        this.groupware.getEmailFromSpice();
    }

    /**
     * @return boolean if the system is archiving
     */
    get isLoading(): boolean {
        return this.groupware.isArchiving;
    }

    /**
     * loads the componentconfig if not passed in
     */
    public ngOnInit() {
        // check that we have a config if no load it
        if(!this.componentconfig) {
            this.componentconfig = this.metadata.getComponentConfig('GroupwareEmailArchivePane');
        }

        // get the panels and load the panel item configs and store them
        if (this.componentconfig && this.componentconfig.componentset) {
            let items = this.metadata.getComponentSetObjects(this.componentconfig.componentset);
            this.componentconfig = [];
            for (let item of items) {
                // else add the tab
                this.componentconfig.push(item.componentconfig);
            }
        }

        this.view.isEditable = true;
        this.view.setEditMode();
    }

    /**
     * a simple getter to see if the tabs are defined
     */
    private getTabs() {
        try {
            return this.componentconfig ? this.componentconfig : [];
        } catch (e) {
            return [];
        }
    }

    private setActiveTabIndex(index){
        this.activetab = index;
    }

    /**
     * Sets a tab as open and displays its content.
     * @param tab
     */
    private open(tab) {
        this.activetab = tab;
    }

    /**
     * Checks if the current email has already been archived in SpiceCRM.
     */
    get isArchived() {
        if (this.groupware.emailId.length === 0) {
            return false;
        }

        return true;
    }
}
