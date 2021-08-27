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
