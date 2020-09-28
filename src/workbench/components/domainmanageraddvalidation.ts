/**
 * @module WorkbenchModule
 */
import {
    Component
} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {domainmanager} from '../services/domainmanager.service';

/**
 * a modal window to add a new validation to a domain field
 */
@Component({
    templateUrl: './src/workbench/templates/domainmanageraddvalidation.html'
})
export class DomainManagerAddValidation {

    /**
     * reference to the modal itself
     */
    private self: any;

    /**
     *  an empty validation record
     */
    private fieldvalidation: any = {
        scope: 'g'
    };

    constructor(private domainmanager: domainmanager, private modelutilities: modelutilities) {

    }

    /**
     * select the validation id
     *
     * @param id
     */
    private selectValidation(id) {
        this.domainmanager.domainfields.find(f => f.id == this.domainmanager.currentDomainField).sysdomainfieldvalidation_id = id;
        this.close();
    }

    /**
     * adds the validation, selects it and closes the modal
     */
    private add() {
        this.fieldvalidation.id = this.modelutilities.generateGuid();
        this.domainmanager.domainfieldvalidations.push(this.fieldvalidation);
        this.selectValidation(this.fieldvalidation.id);
    }

    /**
     * close the modal
     */
    private close() {
        this.self.destroy();
    }

}
