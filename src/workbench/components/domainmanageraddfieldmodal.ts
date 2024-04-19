/**
 * @module WorkbenchModule
 */
import {
    Component, OnInit
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {modelutilities} from '../../services/modelutilities.service';
import {backend} from '../../services/backend.service';
import {domainmanager} from '../services/domainmanager.service';
import {DomainDefinition, DomainField} from "../interfaces/domainmanager.interfaces";

/**
 * a modal window to add a fields to a domain definition
 */
@Component({
    // selector: 'domain-manager-add-field-modal',
    templateUrl: '../templates/domainmanageraddfieldmodal.html',
})
export class DomainManagerAddFieldModal implements OnInit{

    /**
     * reference to the modal self
     */
    public self: any;

    /**
     * the domain definition
     */
    public domainfield: DomainField;

    public domainDefiniton: DomainDefinition;

    constructor(public domainmanager: domainmanager, public backend: backend, public metadata: metadata, public modelutilities: modelutilities) {

    }

    public ngOnInit() {
        // gets the current definition
        this.domainDefiniton = this.domainmanager.getCurrentDefinition();
        // initialize the domainfield
        this.domainfield = {
            dbtype: undefined,
            id: this.modelutilities.generateGuid(),
            sysdomaindefinition_id: this.domainmanager.currentDomainDefinition,
            sysdomainfieldvalidation_id: "",
            name: '{sysdictionaryitems.name}',
            fieldtype: '',
            scope: this.domainDefiniton.scope,
            sequence: this.domainmanager.domainfields.filter(d => d.sysdomaindefinition_id == this.domainmanager.currentDomainDefinition).length,
            required: 0,
            exclude_from_index: 0,
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
        return this.domainfield.name && this.domainfield.dbtype && !this.domainmanager.domainfields.find(f => f.name == this.domainfield.name && f.sysdomaindefinition_id == this.domainmanager.currentDomainDefinition);
    }

    /**
     * saves the modal
     */
    public save() {
        if(this.canSave) {
            // add the sequence that represents the number of items
            this.backend.postRequest(`dictionary/domainfield/${this.domainfield.id}`, {}, this.domainfield).subscribe({
                next: (res) => {
                    this.domainmanager.domainfields.push(this.domainfield);
                    this.close();
                }
            });
        }
    }

}
