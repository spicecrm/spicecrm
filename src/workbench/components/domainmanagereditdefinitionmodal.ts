/**
 * @module WorkbenchModule
 */
import { Component } from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {modelutilities} from '../../services/modelutilities.service';
import {DomainDefinition} from "../interfaces/domainmanager.interfaces";
import {backend} from "../../services/backend.service";
import {domainmanager} from "../services/domainmanager.service";


@Component({
    templateUrl: '../templates/domainmanagereditdefinitionmodal.html',
})
export class DomainManagerEditDefinitionModal{
    /**
     * reference to the modal self
     */
    public self: any;

    /**
     * the domain definition
     */
    public domaindefinition: DomainDefinition;

    constructor(public domainmanager: domainmanager, public metadata: metadata, public modelutilities: modelutilities, public backend: backend) {
    }

    /**
     * close the modal
     */
    public close() {
        this.self.destroy();
    }

    /**
     * saves the definition changes
     */

    public save() {
        this.domainmanager.domaindefinitions.some(d => {
            if (d.id != this.domaindefinition.id) return false;
            d.package = this.domaindefinition.package;
            d.version = this.domaindefinition.version;
            d.description = this.domaindefinition.description;
            this.backend.postRequest(`dictionary/domaindefinition/${this.domaindefinition.id}`, {}, this.domaindefinition).subscribe({
                next: (res) => {
                    this.close();
                },
                error: () => {
                    this.close();
                }
            })
            return true;
        })
    }
}