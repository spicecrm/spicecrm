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
 * @module ModuleEmails
 */
import {
    Component,
    ViewContainerRef,
    ViewChild,
    AfterViewInit,
    OnInit,
    Input,
    Output,
    EventEmitter
} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";
import {language} from "../../../services/language.service";
import {backend} from "../../../services/backend.service";

@Component({
    selector: "email-to-object-modal",
    templateUrl: "./src/modules/emails/templates/emailtoobjectmodal.html",
    providers: [model, view]
})
export class EmailToObjectModal implements OnInit, AfterViewInit {

    @ViewChild("detailcontainer", {read: ViewContainerRef, static: true}) private detailcontainer: ViewContainerRef;

    private email_model: any = null;
    private self: any = null;
    private componentRefs: Array<any> = [];
    @Output() public save$ = new EventEmitter();

    @Input() public object_module_name: string;
    @Input() public object_fields = [];
    @Input() public object_relation_link_name: string;
    @Input() public object_predefined_fields: any[];

    constructor(
        private language: language,
        private metadata: metadata,
        private view: view,
        private model: model,
        private backend: backend,
    ) {

    }

    public ngOnInit() {
        this.model.module = this.object_module_name;
        this.model.initializeModel(this.email_model);

        // if there are predefined fields
        if(this.object_predefined_fields)
        {
            // set them in model.data...
            for(let fieldname in this.object_predefined_fields)
            {
                this.model.data[fieldname] = this.object_predefined_fields[fieldname];
            }
        }

        this.view.isEditable = true;
        this.view.setEditMode();
    }

    public ngAfterViewInit() {
        this.buildContainer();
    }

    private close() {
        this.self.destroy();
    }

    private buildContainer() {
        // reset any rendered component
        for (let component of this.componentRefs) {
            component.destroy();
        }
        this.componentRefs = [];

        let componentconfig = this.metadata.getComponentConfig("ObjectRecordDetails", this.model.module);
        for (let panel of this.metadata.getComponentSetObjects(componentconfig.componentset)) {
            this.metadata.addComponent(panel.component, this.detailcontainer).subscribe(componentRef => {
                componentRef.instance.componentconfig = panel.componentconfig;
                this.componentRefs.push(componentRef);
            });
        }
    }

    private setField(data) {
        this.model.setField(data.field, data.value);
    }

    private save() {
        if(this.model.validate()) {
            this.model.save().subscribe(
                res => {
                    // if a relation link is given

                    if (this.object_relation_link_name) {
                        // link this model to emails...
                        this.backend.postRequest("module/Emails/" + this.email_model.id + "/related/" + this.object_relation_link_name, [], [this.model.id]).subscribe(
                            subres => {
                                this.save$.emit(this.model.data);
                                this.close();
                            }
                        );
                    } else {
                        this.save$.emit(this.model.data);
                        this.close();
                    }
                }
            );
        }
    }
}
