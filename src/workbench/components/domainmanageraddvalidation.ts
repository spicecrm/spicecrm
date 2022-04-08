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
    public fieldvalidation: any = {
        scope: 'g'
    };

    constructor(public domainmanager: domainmanager, public modelutilities: modelutilities) {

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
        this.fieldvalidation.id = this.modelutilities.generateGuid();
        this.domainmanager.domainfieldvalidations.push(this.fieldvalidation);
        this.selectValidation(this.fieldvalidation.id);
    }

    /**
     * close the modal
     */
    public close() {
        this.self.destroy();
    }

}
