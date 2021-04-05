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
 * @module ModuleAccounts
 */
import {Component, AfterViewInit, OnInit, OnDestroy, Input} from "@angular/core";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";
import {accountHierarchy} from "../services/accounthierarchy.service";

/**
 * dsiplays a line int he node tree for the account hierarchy
 */
@Component({
    selector: "[account-hierarchy-node]",
    templateUrl: "./src/modules/accounts/templates/accounthierarchynode.html",
    providers: [model, view],
    host: {
        "[attr.aria-level]": "nodedata.level"
    }
})
export class AccountHierarchyNode implements OnInit {
    /**
     * the data for the node that is rendered as model
     */
    @Input() public nodedata: any = {};

    /**
     * the fields to be displayed as per the config and fieldset
     */
    @Input() public fields: any[] = [];

    /**
     * indicator if loading
     */
    private loading: boolean = false;

    constructor(private view: view, private language: language, private metadata: metadata, private accountHierarchy: accountHierarchy, private model: model) {
        this.view.displayLabels = false;
    }

    public ngOnInit() {
        this.model.module = "Accounts";
        this.model.id = this.nodedata.id;
        this.model.data.summary_text = this.nodedata.summary_text;

        // copy fields
        for (let field of this.fields) {
            this.model.data[field.field] = this.nodedata.data[field.field];
        }

        // copy acl
        this.model.data.acl = this.nodedata.data.acl;
    }

    /**
     * expands/collapses a node and loads the data
     */
    private expandNode() {
        if (this.nodedata.expanded) {
            this.accountHierarchy.collapse(this.nodedata.id);
        } else {
            this.loading = true;
            this.accountHierarchy.expand(this.nodedata.id);
        }
    }

    /**
     * simple getter for the icons if openeded or closed
     */
    private getIcon() {
        switch (this.nodedata.expanded) {
            case false:
                return "chevronright";
            case true:
                return "chevrondown";
        }
    }
}
