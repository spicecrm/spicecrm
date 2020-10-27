/**
 * @module WorkbenchModule
 */
import {
    Component
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {modelutilities} from '../../services/modelutilities.service';
import {domainmanager} from '../services/domainmanager.service';

/**
 * a modal window to add a fields to a domain definition
 */
@Component({
    templateUrl: './src/workbench/templates/domainmanageraddfieldmodal.html',
})
export class DomainManagerAddFieldModal {

    /**
     * reference to the modal self
     */
    private self: any;

    /**
     * the domain definition
     */
    private domainfield: any = {
        name: '',
        fieldtype: '',
        scope: 'g',
        required: 0,
        deleted: 0,
        status: 'd'
    };

    constructor(private domainmanager: domainmanager, private metadata: metadata, private modelutilities: modelutilities) {

    }

    /**
     * close the modal
     */
    private close() {
        this.self.destroy();
    }

    /**
     * check if we can save
     *
     * name and fieldtype are defined and name does not exists yet
     *
     */
    get canSave() {
        return this.domainfield.name && this.domainfield.dbtype && !this.domainmanager.domainfields.find(f => f.name == this.domainfield.name && f.sysdomaindefinition_id == this.domainmanager.currentDomainDefinition);
    }

    /**
     * saves the modal
     */
    private save() {
        if(this.canSave) {
            this.domainfield.id = this.modelutilities.generateGuid();
            this.domainfield.sysdomaindefinition_id = this.domainmanager.currentDomainDefinition;
            this.domainmanager.domainfields.push(this.domainfield);
            this.close();
        }
    }


}
