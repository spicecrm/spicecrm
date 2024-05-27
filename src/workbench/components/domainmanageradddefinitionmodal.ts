/**
 * @module WorkbenchModule
 */
import {
    Component, EventEmitter, Output
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {modelutilities} from '../../services/modelutilities.service';
import {backend} from '../../services/backend.service';
import {domainmanager} from '../services/domainmanager.service';
import {DomainDefinition} from "../interfaces/domainmanager.interfaces";

/**
 * a modal component to alow the user to add a new Domain Definition. Called from teh Domain Manager
 */
@Component({
    selector: 'domain-manager-add-definition-modal',
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
    public domaindefinition: DomainDefinition;

    /**
     * an emitter for the new ID
     */
    @Output() public newDefinitionID: EventEmitter<string> = new EventEmitter<string>();

    constructor(public domainmanager: domainmanager, public backend: backend, public metadata: metadata, public modelutilities: modelutilities) {
        this.domaindefinition = {
            id: this.modelutilities.generateGuid(),
            name: '',
            fieldtype: '',
            scope: 'c',
            status: 'd'
        }
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

            this.backend.postRequest(`dictionary/domaindefinition/${this.domaindefinition.id}`, {}, this.domaindefinition).subscribe({
                next: (res) => {
                    this.domainmanager.domaindefinitions.push(this.domaindefinition);
                    this.newDefinitionID.emit(this.domaindefinition.id);
                    this.close();
                }
            })
        }
    }
}
