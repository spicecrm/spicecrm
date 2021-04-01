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
 * @module WorkbenchModule
 */
import {
    Component,
    Input,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import {backend} from '../../services/backend.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {view} from '../../services/view.service';


@Component({
    selector: 'fieldsetmanager-field-details',
    templateUrl: './src/workbench/templates/fieldsetmanagerfielddetails.html',
    providers: [view]
})
export class FieldsetManagerFieldDetails implements OnChanges {

    @Input() public field: any = {};
    private currentField: any = {};
    private fieldtypes: string[] = [];

    private component: string = "";
    public configValues: any = {};


    constructor(private backend: backend, private metadata: metadata, private language: language, private view: view) {
        this.fieldtypes = this.metadata.getFieldTypes();
        this.fieldtypes.sort();
        this.fieldtypes.unshift('');
    }

    public ngOnChanges(changes: SimpleChanges) {

        if (this.field.isViewMode) {
            this.view.setViewMode();
        } else {
            this.view.setEditMode();
        }

        try {
            let currentFieldsetItem;
            this.metadata.getFieldSetItems(this.field.fieldset).some(field => {
                if (field.id == this.field.id) {
                    this.currentField = field;
                    this.component = this.metadata.getFieldTypeComponent(field.fieldconfig.fieldtype);
                    this.configValues = field.fieldconfig;

                    return true;
                }
            });

        } catch (e) {
            this.currentField = {};
        }
    }

    get configValuesLabel() {
        // let ret: any = {};
        // ret = this.configValues;
        let ret = null;
        if ("label" in this.configValues) {
            if (this.configValues.label != null) {
                ret = {name: this.configValues.label};
            }
        }

        // this.configValues.name = this.configValues.label
        return ret;
    }

    set configValuesLabel(val) {
        if (val != null) {
            this.configValues.label = val.name;
        } else {
            this.configValues.label = null;
        }

    }

    public configValuesLabelEmit(val) {
        this.configValuesLabel = val;
    }


    get InputConfig() {
        let ret = {option: "name", type: "label", description: ""};
        // ret.option = this.language.getAppLanglabel('LBL_LABEL');
        return ret;
    }

    private getFieldConfig() {
        if (this.configValues.fieldtype) {
            let fieldComponent = this.metadata.getFieldTypeComponent(this.configValues.fieldtype);
            let configOptions = this.metadata.getComponentConfigOptions(fieldComponent);

            let optionsArray = [];
            for (let option in configOptions) {
                optionsArray.push(option);
            }
            return optionsArray;
        } else {
            return [];
        }
    }

    private selectFieldType() {
        this.component = this.metadata.getFieldTypeComponent(this.configValues.fieldtype);
        // this.configValues = Object.assign({}, this.configValues);
    }
}
