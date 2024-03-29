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
    templateUrl: '../templates/domainmanageradddefinitionmodal.html',
})
export class DomainManagerAddDefinitionModal {

    /**
     * reference to the modal self
     */
    public self: any;

    /**
     * the domain definition
     */
    public domaindefinition: any = {
        name: '',
        fieldtype: '',
        scope: 'c',
        deleted: 0,
        status: 'd'
    };

    constructor(public domainmanager: domainmanager, public metadata: metadata, public modelutilities: modelutilities) {

    }

    /**
     * close the modal
     */
    public close() {
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
    public save() {
        if(this.canSave) {
            this.domaindefinition.id = this.modelutilities.generateGuid();
            this.domainmanager.domaindefinitions.push(this.domaindefinition);
            this.close();
        }
    }
}
