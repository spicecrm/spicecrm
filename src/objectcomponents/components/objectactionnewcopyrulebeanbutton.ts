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
import {Component, Directive, Inject, OnInit, Optional, ViewChild} from "@angular/core";
import {metadata} from "../../services/metadata.service";
import {model} from "../../services/model.service";
import {language} from "../../services/language.service";
import {relatedmodels} from "../../services/relatedmodels.service";

/**
 * a helper component used in ObjectActionNewCopyRuleBeanButton
 *
 * does nothing but provide a model
 */
@Directive({
    selector: "object-action-new-copy-rule-bean-button-model-helper",
    providers: [model]
})
export class ObjectActionNewCopyRuleBeanButtonModelHelper {
    constructor(public model: model) {
    }
}

/**
 * adds a button that crteates a new model by copying from the model in teh scope and also from teh related model if one is found
 *
 * actionconfig required! Example: '{ "module": "Calls", "label": "LBL_ADD_CALL" }'
 */
@Component({
    selector: "object-action-new-copy-rule-bean-button",
    templateUrl: "./src/objectcomponents/templates/objectactionnewcopyrulebeanbutton.html",
})
export class ObjectActionNewCopyRuleBeanButton implements OnInit {

    /**
     * this is a helper so we have a subcomponent that can provide a new model
     *
     * this model is detected via teh component and then addressed
     */
    @ViewChild(ObjectActionNewCopyRuleBeanButtonModelHelper, {static: true}) private child;

    /**
     * the parent model in which the action is happening
     */
    public parent: any = {};

    /**
     * if the button is disabled
     */
    public disabled: boolean = true;

    /**
     * the actzion config from the actionset
     */
    public actionconfig: any = {};

    constructor(private language: language, private metadata: metadata, private model: model, @Optional() private relatedmodels: relatedmodels) {

    }

    /**
     * initialize and determine if we can add fopr that type of model with the users ACL
     */
    public ngOnInit() {
        // check acl
        if (this.actionconfig.module && this.metadata.checkModuleAcl(this.actionconfig.module, "create")) {
            this.disabled = false;
        }
    }

    /**
     * execute the button action
     */
    public execute() {
        // Set the module of the new model and open a modal with copy rules
        this.child.model.module = this.actionconfig.module;

        // set the parents
        let parents = [this.parent];
        if (this.relatedmodels && this.relatedmodels.model) parents.push(this.relatedmodels.model);

        this.child.model.addModel("", parents);
    }
}



