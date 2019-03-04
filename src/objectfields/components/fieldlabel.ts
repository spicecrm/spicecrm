/**
 * @module ObjectFields
 */
import {Component, Input} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'field-label',
    templateUrl: './src/objectfields/templates/fieldlabel.html'
})
export class fieldLabel {
    @Input() private fieldname: string = '';
    @Input() private fieldconfig: any = {};
    @Input() private addclasses: string = 'slds-form-element__label';

    constructor(
        private model: model,
        private view: view,
        private language: language
    ) {

    }

    get stati() {
        let stati = this.model.getFieldStati(this.fieldname);

        if (stati.editable && (!this.view.isEditable || this.fieldconfig.readonly)) {
            stati.editable = false;
        }

        // add required flag if set via fieldconfig
        if (this.fieldconfig.required) {
            stati.required = true;
        }

        return stati;
    }

    private isRequired() {
        return this.stati.editable && this.stati.required;
    }

    private isEditable() {
        return this.stati.editable;
        /*
        if (!this.view.isEditable || this.fieldconfig.readonly)
            return false;
        else
            return true;
        */
    }

    private isEditMode() {
        if (this.view.isEditMode() && this.isEditable()) {
            return true;
        } else {
            return false;
        }
    }

    get hidden() {
        return this.fieldconfig.hidelabel ? true : false;
    }

    get label() {
        if (this.fieldconfig.label) {
            if (this.fieldconfig.label.indexOf(':') > 0) {
                let fielddetails = this.fieldconfig.label.split(':');
                return this.language.getLabel(fielddetails[1], fielddetails[0], this.view.labels);
            } else {
                return this.language.getLabel(this.fieldconfig.label, this.model.module, this.view.labels)
            }
        } else {
            return this.language.getFieldDisplayName(this.model.module, this.fieldname, this.fieldconfig, this.view.labels)
        }
    }

}
