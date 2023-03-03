/**
 * @module WorkbenchModule
 */
import {
    Component, EventEmitter, Output
} from '@angular/core';
import {domainmanager} from '../services/domainmanager.service';

/**
 * a modal to select a validation defined in the system and add it to a domain field
 */
@Component({
    templateUrl: '../templates/domainmanagerselectvalidation.html'
})
export class DomainManagerSelectValidation {

    /**
     * reference to the modal itself
     */
    public self: any;

    public validations: any[] = [];

    @Output() public validation: EventEmitter<string> = new EventEmitter<string>();

    constructor(public domainmanager: domainmanager) {
        this.validations = domainmanager.domainfieldvalidations.sort((a, b) => a.name > b.name ? 1 : -1);
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
