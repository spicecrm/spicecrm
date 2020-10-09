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
 * a modal component to alow the user to add a new Domain Definition. Called from teh Domain Manager
 */
@Component({
    templateUrl: './src/workbench/templates/domainmanageradddefinitionmodal.html',
})
export class DomainManagerAddDefinitionModal {

    /**
     * reference to the modal self
     */
    private self: any;

    /**
     * the domain definition
     */
    private domaindefinition: any = {
        name: '',
        fieldtype: '',
        scope: 'g',
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
        return this.domaindefinition.name && this.domaindefinition.fieldtype && !this.domainmanager.domaindefinitions.find(d => d.name == this.domaindefinition.name);
    }

    /**
     * saves the modal
     */
    private save() {
        if(this.canSave) {
            this.domaindefinition.id = this.modelutilities.generateGuid();
            this.domainmanager.domaindefinitions.push(this.domaindefinition);
            this.close();
        }
    }
}
