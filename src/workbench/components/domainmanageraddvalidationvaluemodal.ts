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
    templateUrl: '../templates/domainmanageraddvalidationvaluemodal.html'
})
export class DomainManagerAddValidationValueModal {

    /**
     * reference to the modal itself
     */
    public self: any;

    /**
     *  an empty validation record
     */
    public fieldvalidationvalue: any = {
        scope: 'g',
        sysdomainfieldvalidation_id: null,
        sequence: 0,
        deleted: 0,
        status: 'd'
    };

    constructor(public domainmanager: domainmanager, public modelutilities: modelutilities) {

    }

    /**
     * adds the validation, selects it and closes the modal
     */
    public add() {
        this.fieldvalidationvalue.id = this.modelutilities.generateGuid();
        this.domainmanager.domainfieldvalidationvalues.push(this.fieldvalidationvalue);
        this.close();
    }

    /**
     * close the modal
     */
    public close() {
        this.self.destroy();
    }

}
