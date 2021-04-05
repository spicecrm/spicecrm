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
    templateUrl: './src/objectfields/templates/fieldlabel.html'
})
export class fieldLabel {
    @Input() private fieldname: string = '';
    @Input() private fieldconfig: any = {};
    @Input() private addclasses: string = 'slds-form-element__label';
    private showHelp: boolean = false;

    constructor(
        private model: model,
        private metadata: metadata,
        private view: view,
        private userPreferences: userpreferences,
        private language: language,
        private footer: footer,
        private injector: Injector
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
    private showContext(e) {
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
