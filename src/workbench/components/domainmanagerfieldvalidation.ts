/**
 * @module WorkbenchModule
 */
import {
    Component, Injector, OnInit
} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {modal} from '../../services/modal.service';
import {backend} from '../../services/backend.service';
import {domainmanager} from '../services/domainmanager.service';
import {DomainValidationValue, DomainValidation} from "../interfaces/domainmanager.interfaces";

/**
 * a component rendering the validation details as part of a domain field
 */
@Component({
    selector: 'domain-manager-field-validation',
    templateUrl: '../templates/domainmanagerfieldvalidation.html'
})
export class DomainManagerFieldValidation implements OnInit {

    public self: any;

    /**
     * the field
     */
    field: any = {};

    /**
     * define which fields are displayed
     */
    public view: 'core'|'extended' = "core";

    public validation: DomainValidation;

    public validationvalues: DomainValidationValue[] = [];
    /**
     * keep the deleted ids until save
     */
    public deletedValidationIds: string[] = [];

    constructor(public domainmanager: domainmanager, public backend: backend, public modelutilities: modelutilities, public modal: modal, public injector: Injector) {

    }

    /**
     * get the validation values
     */
    public ngOnInit() {
        // get the valdiation
        this.validation = this.domainmanager.getValidationById(this.field.sysdomainfieldvalidation_id)
        // get the values
        this.validationvalues = this.domainmanager.getValidationValuesdById(this.field.sysdomainfieldvalidation_id).sort((a, b) => +a.sequence > +b.sequence ? 1 : -1);
    }


    /**
     * sitches the view
     */
    public switchView(e: MouseEvent){
        e.preventDefault();
        e.stopPropagation();
        switch (this.view){
            case 'core':
                this.view = 'extended';
                break;
            case 'extended':
                this.view = 'core';
                break;
        }
    }

    /**
     * adds a validation value
     *
     * @param e
     */
    public addValidationValue(e: MouseEvent) {
        e.stopPropagation();
        this.modal.openModal('DomainManagerAddValidationValueModal', true, this.injector).subscribe(modalRef => {
            modalRef.instance.fieldvalidationvalues = this.validationvalues;
            modalRef.instance.fieldvalidation = this.validation;
            modalRef.instance.validationValue.subscribe({
                next: (value: DomainValidationValue) => {
                    this.validationvalues.push(value);
                }
            });
        });
    }

    /**
     * deletes the record with the given ID
     *
     * @param id
     */
    public deleteValidation(validationValue: DomainValidationValue) {
        // no deletion of active ones
        if(validationValue.status == 'a') return;
        // prompt the user
        this.modal.prompt('confirm', 'MSG_DELETE_RECORD', 'MSG_DELETE_RECORD').subscribe(answer => {
            if (answer) {
                let index = this.validationvalues.findIndex(v => v.id == validationValue.id);
                if (index >= 0) {
                    // delete the value from the array and if the deleted value was custom restore the customized global value
                    const globalValue = validationValue.scope != 'c' ? undefined : this.domainmanager.domainfieldvalidationvalues.find(v => v.enumvalue == validationValue.enumvalue && v.scope == 'g');
                    this.deletedValidationIds.push(validationValue.id);
                    this.validationvalues.splice(index, 1);
                    if (globalValue) this.validationvalues.splice(index, 0, globalValue);
                }
            }
        });
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
                    this.domainmanager.currentDomainScope = newValue.scope;
                    const idx = this.validationvalues.findIndex(v => v.id == validationValue.id);
                    this.validationvalues.splice(idx, 1, newValue);
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
     * checks a single value if there is a duplicate
     * @param value
     */
    public hasDuplicate(value: DomainValidationValue){
        return !!this.validationvalues.find(v => v.id != value.id && v.enumvalue == value.enumvalue);
    }

    /**
     * checks all validation cvalues for duplicates .. if one is found retunrs that we have some
     *
     * @private
     */
    get hasDuplicates(){
        let hasDuplicates = false;
        for(let v of this.validationvalues){
            if(this.hasDuplicate(v)) {
                hasDuplicates = true;
                break;
            }
        };
        return hasDuplicates;
    }

    /**
     * a getter to see if we can save or have diuplciate values
     */
    get canSave(){
        if(this.hasDuplicates) return false;

        return true;
    }

    public save(){
        this.backend.postRequest(`dictionary/domainvalidation/${this.field.sysdomainfieldvalidation_id}/values`, {}, this.validationvalues).subscribe({
            next: (res) => {
                // handle the values
                this.validationvalues.forEach(v => {
                    let cv = this.domainmanager.domainfieldvalidationvalues.find(fv => fv.id == v.id);
                    if(cv){
                        Object.getOwnPropertyNames(v).forEach(n => cv[n] = v[n]);
                    } else {
                        this.domainmanager.domainfieldvalidationvalues.push(v);
                    }
                });

                this.domainmanager.domainfieldvalidationvalues = this.domainmanager.domainfieldvalidationvalues.filter(v => !this.deletedValidationIds.some(dId => v.id == dId))

                this.domainmanager.reloadLanguageData();
                this.close();
            }
        })
    }

    public close(){
        this.self.destroy();
    }
}
