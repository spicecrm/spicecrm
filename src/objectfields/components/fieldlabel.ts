/**
 * @module ObjectFields
 */
import {Component, Input, Injector, OnInit} from '@angular/core';
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
export class fieldLabel  implements OnInit{
    @Input() public fieldname: string = '';
    @Input() public fieldconfig: any = {};
    @Input() public addclasses: string = 'slds-form-element__label';
    public showHelp: boolean = false;
    public alignment: 'left'|'right'|'center' = 'left';
    public displayClasses: string;

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

    public ngOnInit() {
        // check if we shoudl determine the laignment of the label
        if(this.view.alignLabels) {
            let fieldType = this.fieldconfig.fieldtype ? this.fieldconfig.fieldtype : this.metadata.getFieldType(this.model.module, this.fieldname);
            switch (fieldType) {
                case 'double':
                case 'float':
                case 'currency':
                case 'probability':
                    this.alignment = 'right';
                    break;
            }

            if(this.fieldname == 'amount_net') console.log(fieldType);
        }

        // set the displayclasses
        this.displayClasses = this.addclasses;

        // switch and set the alignment class
        switch (this.alignment){
            case "right":
                this.displayClasses += ' slds-float_right';
                break;
            default:
                this.displayClasses += ' slds-float_left';
                break;
        }
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
