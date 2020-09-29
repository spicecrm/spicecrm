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
    templateUrl: './src/workbench/templates/domainmanagerselectvalidation.html'
})
export class DomainManagerSelectValidation {

    /**
     * reference to the modal itself
     */
    private self: any;

    private validations: any[] = [];

    constructor(private domainmanager: domainmanager) {
        this.validations = domainmanager.domainfieldvalidations.filter(d => d.deleted == 0).sort((a, b) => a.name > b.name ? 1 : -1);
    }

    /**
     * select the validation id
     *
     * @param id
     */
    private selectValidation(id){
        this.domainmanager.domainfields.find(f => f.id == this.domainmanager.currentDomainField).sysdomainfieldvalidation_id = id;
        this.close();
    }

    /**
     * close the modal
     */
    private close() {
        this.self.destroy();
    }

}
