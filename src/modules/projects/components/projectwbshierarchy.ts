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
import {model} from "../../../services/model.service";
import {broadcast} from "../../../services/broadcast.service";
import {relatedmodels} from "../../../services/relatedmodels.service";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";
import {projectwbsHierarchy} from "../services/projectwbshierarchy.service";

@Component({
    selector: "projectwbs-hierarchy",
    templateUrl: "./src/modules/projects/templates/projectwbshierarchy.html",
    providers: [projectwbsHierarchy, relatedmodels]
})
export class ProjectWBSHierarchy implements OnInit {
    /**
     * the component config
     * @private
     */
    private componentconfig: any = {};

    /**
     * the fieldsets to be displayed
     * @private
     */
    private fieldsetFields: any[] = [];

    constructor(private language: language, private metadata: metadata, private projectwbsHierarchy: projectwbsHierarchy, private model: model, private relatedmodels: relatedmodels, private broadcast: broadcast) {

        // needed for the button in the actionset
        this.relatedmodels.relatedModule = "ProjectWBSs";

        this.broadcast.message$.subscribe(message => {
            this.handleMessage(message);
        });

    }

    /**
     * handles message coming from broadcasting
     * Reloads hierarchy if conditions are matched
     * @param message
     * @private
     */
    private handleMessage(message: any) {
        // only handle if the module is the list module
        if (message.messagetype.indexOf("model") === -1 || message.messagedata.module !== "ProjectWBSs" || (message.messagedata.module === "ProjectWBSs" && message.messagetype === "model.loaded")) {
            return;
        }

        this.loadHierarchy();
    }

    /**
     * calls hierarchy service and load data
     * @private
     */
    private loadHierarchy() {
        this.projectwbsHierarchy.project_id = this.model.id;
        this.projectwbsHierarchy.loadHierarchy();
    }

    public ngOnInit() {
        this.fieldsetFields = this.metadata.getFieldSetFields(this.componentconfig.fieldset);

        // relate model set needed for the button in the actionset
        if(this.componentconfig.link) {
            this.relatedmodels.linkName = this.componentconfig.link;
        }
        this.relatedmodels.module = this.model.module;
        this.relatedmodels.id = this.model.id;

        this.loadHierarchy();
    }

    /**
     * used to display spinner when hiearchy container is being laoded
     * @private
     */
    private isLoading() {
        return this.projectwbsHierarchy.isloading;
    }

}
