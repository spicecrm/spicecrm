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
    Input, OnChanges, SimpleChanges, Injector
} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {language} from '../../services/language.service';
import {modal} from '../../services/modal.service';
import {domainmanager} from '../services/domainmanager.service';

/**
 * a component rendering the validation details as part of a domain field
 */
@Component({
    selector: 'domainmanager-field-validation',
    templateUrl: './src/workbench/templates/domainmanagerfieldvalidation.html'
})
export class DomainManagerFieldValidation implements OnChanges {

    /**
     * the field
     */
    @Input() private field: any = {};

    constructor(private domainmanager: domainmanager, private language: language, private modelutilities: modelutilities, private modal: modal, private injector: Injector) {

    }

    public ngOnChanges(changes: SimpleChanges): void {

    }

    get validation() {
        return this.domainmanager.getValidationById(this.field.sysdomainfieldvalidation_id);
    }

    get validationvalues() {
        return this.domainmanager.getValdiationValuesdById(this.field.sysdomainfieldvalidation_id).sort((a, b) => a.sequence > b.sequence ? 1 : -1);
    }

    /**
     * adds a validation value
     *
     * @param e
     */
    private addValidationValue(e: MouseEvent) {
        e.stopPropagation();
        this.modal.openModal('DomainManagerAddValidationValueModal', true, this.injector).subscribe(modalRef => {
            modalRef.instance.fieldvalidationvalue.sysdomainfieldvalidation_id = this.field.sysdomainfieldvalidation_id;
            modalRef.instance.fieldvalidationvalue.sequence = this.validationvalues.length;
        });
    }

    /**
     * deletes the record with the given ID
     *
     * ToDo: add prompt
     *
     * @param id
     */
    private deleteValidation(e: MouseEvent, id: string) {
        e.preventDefault();
        let index = this.domainmanager.domainfieldvalidationvalues.findIndex(v => v.id == id);
        if (index >= 0) {
            this.domainmanager.domainfieldvalidationvalues.splice(index, 1);
        }
    }

    /**
     * customize the validation value
     *
     * @param e
     * @param validationValue
     */
    private customizeValidationValue(e: MouseEvent, validationValue) {
        e.stopPropagation();
        if (validationValue.scope == 'g') {
            this.modal.prompt('confirm', 'Customize the Domain?', 'Customize').subscribe(resp => {
                if (resp) {
                    let newValue = {...validationValue};
                    newValue.id = this.modelutilities.generateGuid();
                    newValue.scope = 'c';
                    this.domainmanager.domainfieldvalidationvalues.push(newValue);
                }
            });
        }
    }



    /**
     * handles the drop event and resets the sequence fiels
     * @param event
     */
    private drop(event) {
        // get the values and reshuffle
        let values = this.validationvalues;
        let previousItem = values.splice(event.previousIndex, 1);
        values.splice(event.currentIndex, 0, previousItem[0]);

        // reindex the array resetting the sequence
        let i = 0;
        for (let item of values) {
            item.sequence = i;
            i++;
        }
    }

    /**
     * unlinks the validation
     */
    private unlinkValidation() {
        this.field.sysdomainfieldvalidation_id = null;
    }

    /**
     * select a validation
     */
    private selectValidation() {
        this.modal.openModal('DomainManagerSelectValidation', true, this.injector);

    }

    /**
     * add a validation
     */
    private addValidation() {
        this.modal.openModal('DomainManagerAddValidation', true, this.injector);

    }
}
