/**
 * @module WorkbenchModule
 */
import {
    Component, EventEmitter, Output
} from '@angular/core';
import {domainmanager} from '../services/domainmanager.service';
import {DomainValidation} from "../interfaces/domainmanager.interfaces";

/**
 * a modal to select a validation defined in the system and add it to a domain field
 */
@Component({
    selector: 'domain-manager-select-validation',
    templateUrl: '../templates/domainmanagerselectvalidation.html'
})
export class DomainManagerSelectValidation {

    /**
     * reference to the modal itself
     */
    public self: any;

    /**
     * the list of validations
     */
    public _validations: DomainValidation[] = [];

    /**
     * a filter term to support easier finding of a validation
     */
    public filterterm: string;

    /**
     * an event emitter that emits validations
     */
    @Output() public validation: EventEmitter<string> = new EventEmitter<string>();

    constructor(public domainmanager: domainmanager) {
        this._validations = domainmanager.domainfieldvalidations.sort((a, b) => a.name > b.name ? 1 : -1);
    }

    /**
     * a getter to return filtered validations
     */
    get validations(){
        if(this.filterterm){
            return this._validations.filter(v => v.name.toLowerCase().indexOf(this.filterterm.toLowerCase()) >= 0);
        }
        return this._validations;
    }

    /**
     * select the validation id
     *
     * @param id
     */
    public selectValidation(id){
        this.validation.emit(id);
        // this.domainmanager.domainfields.find(f => f.id == this.domainmanager.currentDomainField).sysdomainfieldvalidation_id = id;
        this.close();
    }

    /**
     * adds a new
     */
    public new() {
        this.validation.emit('new');
        this.close();
    }

    /**
     * close the modal
     */
    public close() {
        this.self.destroy();
    }

}
