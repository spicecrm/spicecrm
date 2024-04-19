/**
 * @module WorkbenchModule
 */
import {
    Component, EventEmitter, Output
} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {backend} from '../../services/backend.service';
import {domainmanager} from '../services/domainmanager.service';
import {DomainValidation} from "../interfaces/domainmanager.interfaces";

/**
 * a modal window to add a new validation to a domain field
 */
@Component({
    templateUrl: '../templates/domainmanageraddvalidation.html'
})
export class DomainManagerAddValidation {

    /**
     * reference to the modal itself
     */
    public self: any;

    /**
     *  an empty validation record
     */
    public fieldvalidation: DomainValidation ;

    @Output() public validation: EventEmitter<string> = new EventEmitter<string>();


    constructor(public domainmanager: domainmanager, public backend: backend, public modelutilities: modelutilities) {
        this.fieldvalidation = {
            name: "",
            order_by: undefined,
            sort_flag: undefined,
            status: 'a',
            validation_type: "enum",
            scope: 'c',
            id: this.modelutilities.generateGuid()
        }
    }

    /**
     * select the validation id
     *
     * @param id
     */
    public selectValidation(id) {
        this.domainmanager.domainfields.find(f => f.id == this.domainmanager.currentDomainField).sysdomainfieldvalidation_id = id;
        this.close();
    }

    /**
     * adds the validation, selects it and closes the modal
     */
    public add() {
        this.backend.postRequest(`dictionary/domainvalidation/${this.fieldvalidation.id}`, {}, this.fieldvalidation).subscribe({
            next: (res) => {
                this.domainmanager.domainfieldvalidations.push(this.fieldvalidation);
                this.validation.emit(this.fieldvalidation.id);
                this.close();
            }
        })
    }

    /**
     * close the modal
     */
    public close() {
        this.self.destroy();
    }

}
