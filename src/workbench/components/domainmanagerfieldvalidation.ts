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
    templateUrl: '../templates/domainmanagerfieldvalidation.html'
})
export class DomainManagerFieldValidation implements OnChanges {

    /**
     * the field
     */
    @Input() public field: any = {};

    constructor(public domainmanager: domainmanager, public language: language, public modelutilities: modelutilities, public modal: modal, public injector: Injector) {

    }

    public ngOnChanges(changes: SimpleChanges): void {

    }

    get validation() {
        return this.domainmanager.getValidationById(this.field.sysdomainfieldvalidation_id);
    }

    get validationvalues() {
        return this.domainmanager.getValidationValuesdById(this.field.sysdomainfieldvalidation_id).sort((a, b) => a.sequence > b.sequence ? 1 : -1);
    }

    /**
     * adds a validation value
     *
     * @param e
     */
    public addValidationValue(e: MouseEvent) {
        e.stopPropagation();
        this.modal.openModal('DomainManagerAddValidationValueModal', true, this.injector).subscribe(modalRef => {
            modalRef.instance.fieldvalidationvalue.sysdomainfieldvalidation_id = this.field.sysdomainfieldvalidation_id;
            modalRef.instance.fieldvalidationvalue.sequence = this.validationvalues.length;
            modalRef.instance.fieldvalidationvalue.scope = this.domainmanager.currentDomainScope;
        });
    }

    /**
     * deletes the record with the given ID
     *
     * ToDo: add prompt
     *
     * @param id
     */
    public deleteValidation(e: MouseEvent, id: string) {
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
    public customizeValidationValue(e: MouseEvent, validationValue) {
        e.stopPropagation();
        if (validationValue.scope == 'g') {
            this.modal.prompt('confirm', 'Customize the Domain?', 'Customize').subscribe(resp => {
                if (resp) {
                    let newValue = {...validationValue};
                    newValue.id = this.modelutilities.generateGuid();
                    newValue.scope = 'c';
                    this.domainmanager.domainfieldvalidationvalues.push(newValue);
                    this.domainmanager.currentDomainScope = newValue.scope;
                }
            });
        }
    }



    /**
     * handles the drop event and resets the sequence fiels
     * @param event
     */
    public drop(event) {
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
    public unlinkValidation() {
        this.field.sysdomainfieldvalidation_id = null;
    }

    /**
     * select a validation
     */
    public selectValidation() {
        this.modal.openModal('DomainManagerSelectValidation', true, this.injector);

    }

    /**
     * add a validation
     */
    public addValidation() {
        this.modal.openModal('DomainManagerAddValidation', true, this.injector);

    }
}
