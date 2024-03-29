/**
 * @module WorkbenchModule
 */
import {
    Component
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

    constructor(public domainmanager: domainmanager) {
        this.validations = domainmanager.domainfieldvalidations.filter(d => d.deleted == 0).sort((a, b) => a.name > b.name ? 1 : -1);
    }

    /**
     * select the validation id
     *
     * @param id
     */
    public selectValidation(id){
        this.domainmanager.domainfields.find(f => f.id == this.domainmanager.currentDomainField).sysdomainfieldvalidation_id = id;
        this.close();
    }

    /**
     * close the modal
     */
    public close() {
        this.self.destroy();
    }

}
