/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module ModuleProjects
 */
import {Component, OnInit} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";
import {language} from "../../../services/language.service";
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";
import {modellist} from '../../../services/modellist.service';

/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: "project-activity-dashlet",
    templateUrl: "./src/modules/projects/templates/projectactivitydashlet.html",
    providers: [modellist]
})
export class ProjectActivityDashlet implements OnInit {
    // private recent_project_activities: any = [];
    private module: string = 'ProjectActivities';

    /**
     * the subscription to the modellist
     */
    private modellistsubscribe: any = undefined;

    /**
     * the componentconfig
     */
    public componentconfig: any = {};


    /**
     * all fields that are available
     */
    // private allFields: any[] = [];

    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
        private view: view,
        private backend: backend,
        private toast: toast,
        private modellist: modellist
    ) {

        // get the config
        this.componentconfig = this.metadata.getComponentConfig('ProjectActivityDashlet');

        // set modellist config
        this.modellist.loadlimit = this.limit;
        this.modellist.module = this.module;
        if(!this.modellist.currentList.sortfields) {
            this.modellist.currentList.sortfields = btoa('{"sortfield": "date_entered", "sortdirection": "DESC"}');
        }

        // load the list and initialize from session data if this is set
        // this.loadRecentActivities();
    }

    public ngOnInit() {
        // load the last activities entered
        this.loadRecentActivities();
    }


    /**
     * returns the sortfield from the config
     */
    get sortfield() {
        if(this.componentconfig?.sortfield) {
            return this.componentconfig.sortfield;
        }
        return '';
    }

    /**
     * returns the sortdirection from the componentconfig
     */
    get sortdirection() {
        if(this.componentconfig?.sortdirection !== undefined) {
            return this.componentconfig.sortdirection ;
        }
        return '';
    }

    /**
     * returns the limit from the componentconfig
     */
    get limit() {
        if(this.componentconfig?.limit !== undefined) {
            return this.componentconfig.limit;
        }
        return 10;
    }

    /**
     * returns if the listservic eis loading
     */
    get isloading() {
        return this.modellist.isLoading;
    }

    /**
     * trackby function to optimize performance on the for loop
     *
     * @param index
     * @param item
     */
    protected trackbyfn(index, item) {
        return item.id;
    }

    /**
     * function to load the listdata. Checks on the listdata if the component is the same .. if yes .. no reload is needed
     * this can happen when the list is loaded from the appdata service that cahces the previous list
     *
     * @param loadfromcache
     */
    private loadRecentActivities() {
        this.modellist.setListType('owner', false, [{sortfield: "date_entered", sortdirection: "DESC"}]);
    }
}
