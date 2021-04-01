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
 * @module ModuleEmails
 */

import {Component, EventEmitter, OnDestroy, Output} from "@angular/core";
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";
import {modal} from "../../../services/modal.service";
import {metadata} from "../../../services/metadata.service";
import {relatedmodels} from "../../../services/relatedmodels.service";

/**
 * this renders a button as part of an actionset that allows conversion of an email to an object. The component there allows an action config with the following parameters:
 *
 * - module: the module name of the object that ahosul be created
 * - checklink: the link in the module pointing towards the component. If this is set the component will check if there are object already linked with that module on that link. And if so disable the button
 */
@Component({
    selector: "email-to-object-button",
    templateUrl: "./src/modules/emails/templates/emailtoobjectbutton.html",
    providers: [relatedmodels]
})
export class EmailToObjectButton implements OnDestroy {
    private object_module_name: string;
    private actionconfig; // can be set inside actionsets...
    private relation_subscription; // can be set inside actionsets...
    @Output() public actionemitter = new EventEmitter();
    /**
     * subscription to the model data
     */
    private subscription: any;

    constructor(
        private language: language,
        private model: model,
        private metadata: metadata,
        private modal: modal,
        private relatedmodels: relatedmodels
    ) {

    }

    /**
     * a getter that returns the disabled status. This getter checks if it is allowed for the user to create such a record and if checklink is set in the actionconfig if a record already exists
     */
    get disabled() {
        // check ACL if we can crate such an object at all
        if (!this.metadata.checkModuleAcl(this.actionconfig.module, 'create')) return true;
        if (this.actionconfig.checklink) {
            if (this.relatedmodels.isloading) return true;

            if (this.relatedmodels.count > 0) {
                return true;
            }
        }
        return false;
    }


    public ngOnInit() {
        this.object_module_name = this.actionconfig.module;

        if (this.actionconfig.checklink) {
            this.subscribeToModel();
        }
    }

    public subscribeToModel() {
        this.subscription = this.model.data$.subscribe(
            next => {
                this.getRelatedData();
            }
        );
    }

    public ngOnDestroy() {
        this.subscription?.unsubscribe();
    }

    public getRelatedData() {
        this.relatedmodels.module = this.model.module;
        this.relatedmodels.id = this.model.id;
        this.relatedmodels.relatedModule = this.actionconfig.module;
        this.relatedmodels.linkName = this.actionconfig.checklink;
        this.relatedmodels.getData();
    }

    public execute() {
        this.modal.openModal("EmailToObjectModal", true).subscribe(
            cmpref => {
                cmpref.instance.email_model = this.model;
                cmpref.instance.object_module_name = this.object_module_name;
                cmpref.instance.object_relation_link_name = this.actionconfig.relation_link_name;
                cmpref.instance.object_predefined_fields = this.actionconfig.predefined_fields;
                cmpref.instance.save$.subscribe(
                    data => {
                        this.actionemitter.emit("save");
                    }
                );
            }
        );
    }
}
