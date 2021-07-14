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
 * @module ObjectFields
 */
import {Component, Input, ViewChild, ViewContainerRef, AfterViewInit} from '@angular/core';
import {model} from '../../services/model.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {view} from '../../services/view.service';

@Component({
    selector: 'field-container',
    templateUrl: './src/objectfields/templates/fieldcontainer.html'
})
export class fieldContainer implements AfterViewInit {
    @ViewChild('fieldcontainer', {read: ViewContainerRef, static: true}) private fieldcontainer: ViewContainerRef;

    @Input() private field: string;
    @Input() private fieldconfig: any = {};
    @Input() private fielddisplayclass = 'slds-text-body--regular slds-truncate slds-m-vertical--small spice-fieldbody';

    constructor(
        protected model: model,
        private language: language,
        private metadata: metadata,
        private view: view
    ) {

    }

    @Input()
    set fieldname(val) {
        this.field = val;
    }

    get fieldname() {
        return this.field;
    }

    get stati() {
        let stati = this.model.getFieldStati(this.field);
        return stati;
    }

    public ngAfterViewInit() {
        this.buildContainer();
    }

    private buildContainer() {
        this.metadata.addComponent(this.getFieldType(), this.fieldcontainer).subscribe(componentRef => {
            componentRef.instance.fieldname = this.field;
            componentRef.instance.fieldconfig = this.fieldconfig;
            componentRef.instance.fielddisplayclass = this.fielddisplayclass;
        });
    }

    private getFieldType() {
        let fieldType = '';

        // check if we have a field access
        // if (this.model.data && this.model.data.acl_fieldcontrol && this.model.data.acl_fieldcontrol[this.field] && this.model.data.acl_fieldcontrol[this.field] == '1') {
        if (!this.model.checkFieldAccess(this.field)) {
            return 'fieldNotAuthorized';
        }

        if (this.field === 'blank') {
            fieldType = 'blank';
        } else {
            fieldType = this.fieldconfig.fieldtype ? this.fieldconfig.fieldtype : this.metadata.getFieldType(this.model.module, this.field);
        }

        let fieldtypeComponent = this.metadata.getFieldTypeComponent(fieldType);
        return fieldtypeComponent ? fieldtypeComponent : 'fieldGeneric';

    }
}
