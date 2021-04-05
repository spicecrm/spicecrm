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
import {Component, OnInit, Input} from "@angular/core";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";

import {projectwbsHierarchy} from "../services/projectwbshierarchy.service";

@Component({
    selector: "[projectwbs-hierarchy-node]",
    templateUrl: "./src/modules/projects/templates/projectwbshierarchynode.html",
    providers: [model, view],
    host: {
        "[attr.aria-level]": "nodedata.level"
    }
})
export class ProjectWBSHierarchyNode implements OnInit {
    /**
     * the data from teh members
     */
    @Input() public nodedata: any = {};

    /**
     * the fields to be dispalayed
     */
    @Input() public fields: any[] = [];

    /**
     *
     * @private
     */
    private loading: boolean = false;

    constructor(private language: language, private metadata: metadata, private projectwbsHierarchy: projectwbsHierarchy, private model: model, private view: view) {
        this.view.displayLabels = false;
    }

    public ngOnInit() {
        this.model.module = "ProjectWBSs";
        this.model.id = this.nodedata.id;
        this.model.data = this.model.utils.backendModel2spice(this.model.module, this.nodedata.data);
    }

    get expandable() {
        return this.nodedata.member_count > 0;
    }

    /**
     * returns information if node is expanded or not
     * @private
     */
    private isExpandedNode() {
        return this.nodedata.expanded;
    }

    /**
     * expands or collapses node depending on current state
     * @private
     */
    private expandNode() {
        if (this.isExpandedNode()) {
            this.projectwbsHierarchy.collapse(this.nodedata.id);
        } else {
            this.loading = true;
            this.projectwbsHierarchy.expand(this.nodedata.id);
        }
    }


}
