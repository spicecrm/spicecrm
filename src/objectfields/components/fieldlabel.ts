/**
 * @module ObjectFields
 */
import {Component, Input, Injector} from '@angular/core';
import {model} from '../../services/model.service';
import {metadata} from '../../services/metadata.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {footer} from '../../services/footer.service';
import {userpreferences} from "../../services/userpreferences.service";

@Component({
    selector: 'field-label',
    templateUrl: '../templates/fieldlabel.html'
})
export class fieldLabel {
    @Input() public fieldname: string = '';
    @Input() public fieldconfig: any = {};
    @Input() public addclasses: string = 'slds-form-element__label';
    public showHelp: boolean = false;

    constructor(
        public model: model,
        public metadata: metadata,
        public view: view,
        public userPreferences: userpreferences,
        public language: language,
        public footer: footer,
        public injector: Injector
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

    public isRequired() {
        return this.stati.editable && this.stati.required;
    }

    public isEditable() {
        return this.stati.editable;
        /*
        if (!this.view.isEditable || this.fieldconfig.readonly)
            return false;
        else
            return true;
        */
    }

    public isEditMode() {
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
                return this.language.getLabel(this.fieldconfig.label, this.model.module, this.view.labels);
            }
        } else {
            return this.language.getFieldDisplayName(this.model.module, this.fieldname, this.fieldconfig, this.view.labels);
        }
    }

    get helpText() {
        if (this.userPreferences.toUse.help_icon && this.userPreferences.toUse.help_icon == 'hidden') return false;
        if (this.fieldconfig.helpText) {
            if (this.fieldconfig.helpText.indexOf(':') > 0) {
                let fielddetails = this.fieldconfig.helpText.split(':');
                return this.language.getLabel(fielddetails[1], fielddetails[0], this.view.labels);
            } else {
                return this.language.getLabel(this.fieldconfig.helpText, this.model.module, this.view.labels);
            }
        } else {
            return this.language.getFieldHelpText(this.model.module, this.fieldname, this.fieldconfig);
        }
    }

    /**
     * display a context menu
     * @param e
     */
    public showContext(e) {
        // currently do nothing .. need to finish this
        return;

        // prevent the default evenet
        e.preventDefault();

        // render the popover and pass in the details
        this.metadata.addComponentDirect('fieldLabelPopover', this.footer.footercontainer, this.injector).subscribe(popover => {
            popover.instance.event = e;
            popover.instance.fieldlabel = this.label;
            popover.instance.fieldname = this.fieldname;
            popover.instance.fieldconfig = this.fieldconfig;
        });
    }
}
