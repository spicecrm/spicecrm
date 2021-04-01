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
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {view} from "../../services/view.service";

@Component({
    selector: 'object-page-header-detail-row',
    templateUrl: './src/objectcomponents/templates/objectpageheaderdetailrow.html',
    providers: [view]
})
export class ObjectPageHeaderDetailRow implements OnInit {
    @Input() private fieldSet: string = '';
    @Input() private opacity: number = 1;
    @Input() private collapsed: boolean = true;

    constructor(private metadata: metadata, private model: model, private view: view) {

    }

    public ngOnInit() {
        this.setLabelLength();
    }

    private getFields() {
        let fieldsetFields = this.metadata.getFieldSetFields(this.fieldSet);


        if (this.model.data && this.model.data.acl_fieldcontrol) {
            let thisFieldsetFields = [];
            for (let fieldsetFieldIndex in fieldsetFields) {
                if ( this.metadata.hasField( this.model.module, fieldsetFields[fieldsetFieldIndex].field )) {
                    if( !(this.model.data.acl_fieldcontrol[fieldsetFields[fieldsetFieldIndex].field] && this.model.data.acl_fieldcontrol[fieldsetFields[fieldsetFieldIndex].field] === '1') ) {
                        thisFieldsetFields.push( fieldsetFields[fieldsetFieldIndex] );
                    }
                }
            }

            return thisFieldsetFields;
        }

        fieldsetFields.forEach( ( field, index ) => {
            if ( !this.metadata.hasField( this.model.module, field.field ) ) fieldsetFields.splice( index,1 );
        });
        return fieldsetFields;

    }

    private toggleCollapsed() {
        this.collapsed = !this.collapsed;

        // set the view label length
        this.setLabelLength();
    }

    get toggleIcon() {
        return this.collapsed ? 'chevrondown' : 'chevronup';
    }

    private setLabelLength() {
        if (this.collapsed) {
            this.view.displayLabels = false;
            this.view.labels = 'short';
        } else {
            this.view.displayLabels = true;
            this.view.labels = 'default';
        }
    }

    private showLabel(fieldConfig) {
        if (fieldConfig.hidelabel === true) {
            return false;
        } else {
            return true;
        }
    }

}
