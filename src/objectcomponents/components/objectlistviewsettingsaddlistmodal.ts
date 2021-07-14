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
 * @module ObjectComponents
 */
import {Component, Input, OnInit} from '@angular/core';
import {language} from '../../services/language.service';
import {session} from "../../services/session.service";
import {modellist} from "../../services/modellist.service";

@Component({
    templateUrl: './src/objectcomponents/templates/objectlistviewsettingsaddlistmodal.html'
})
export class ObjectListViewSettingsAddlistModal implements OnInit {

    /**
     * the mode
     */
    @Input() private modalmode: 'edit'|'add' = 'add';

    /**
     * the name to be used to bind to the input field
     */
    private listname: string = '';

    /**
     * binds to the global flag
     */
    private globallist: boolean = false;

    /**
     * holds the list component name
     */
    private listcomponent: string;

    /**
     * reference to the modal self to enable closing it
     */
    private self: any = {};

    public componentListOptions: Array<{label: string, component: string}> = [];

    constructor(
        private language: language,
        private session: session,
        private modellist: modellist
    ) {
    }

    public ngOnInit() {
        this.loadComponentListOptions();
        if (this.modalmode === 'edit') {
            this.listname = this.modellist.currentList.name;
            this.globallist = this.modellist.getGlobal();
            this.listcomponent = this.modellist.currentList.listcomponent;
        }
    }

    /**
     * load the component config and build the list of the available component
     * @private
     */
    private loadComponentListOptions() {
        let config = this.modellist.metadata.getComponentConfig('ObjectListView', this.modellist.module);
        let items = this.modellist.metadata.getComponentSetObjects(config.componentset);
        this.componentListOptions = items.map(item => ({
                component: item.component,
                label: item.componentconfig.name
            }));
        this.listcomponent = this.componentListOptions[0].component;
    }

    /**
     * close the modal
     */
    private close() {
        this.self.destroy();
    }

    /**
     * checks if the list can be saved
     */
    private canSave() {
        return !(this.listname.length > 0);
    }

    /**
     * returns if the user is an admin and thus can set the global flag
     */
    get isadmin() {
        return this.session.isAdmin;
    }

    /**
     * save the list with the modellist service
     */
    private save() {
        if (this.listname.length > 0) {
            const listParams = {
                name: this.listname,
                listcomponent: this.listcomponent,
                global: this.globallist ? '1' : '0'
            };
            switch (this.modalmode) {
                case 'add':
                    this.modellist.addListType(listParams).subscribe(res => {
                        this.close();
                    });
                    break;
                case 'edit':
                    this.modellist.updateListType(listParams).subscribe(res => {
                        this.close();
                    });
                    break;
            }
        }
    }
}
