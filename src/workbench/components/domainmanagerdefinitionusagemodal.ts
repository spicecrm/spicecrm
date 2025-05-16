/**
 * @module WorkbenchModule
 */
import {Component, OnInit} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {modelutilities} from '../../services/modelutilities.service';
import {DomainDefinition} from "../interfaces/domainmanager.interfaces";
import {backend} from "../../services/backend.service";
import {domainmanager} from "../services/domainmanager.service";
import {dictionarymanager} from "../services/dictionarymanager.service";


@Component({
    selector: 'domain-manager-definitio-nusage-modal',
    templateUrl: '../templates/domainmanagerdefinitionusagemodal.html'
})
export class DomainManagerDefinitionUsageModal implements OnInit{
    /**
     * reference to the modal self
     */
    public self: any;

    /**
     * the domain definition
     */
    public domaindefinition: DomainDefinition;

    /**
     * the items this domain definition is used in
     */
    public dictionaryitems: {definitionname: string, itemname: string}[] = [];

    constructor(public domainmanager: domainmanager, public dictionarymanager: dictionarymanager, public metadata: metadata, public modelutilities: modelutilities, public backend: backend) {
    }

    /**
     * load the items
     */
    public ngOnInit() {
        // get the items
        let items = this.dictionarymanager.dictionaryitems.filter(d => d.sysdomaindefinition_id == this.domaindefinition.id);
        items.forEach(i => {
            this.dictionaryitems.push({
                itemname: i.name,
                definitionname: this.dictionarymanager.dictionarydefinitions.find(dd => dd.id == i.sysdictionarydefinition_id).name
            })
        })

        // sort first by definition then by itemname
        this.dictionaryitems.sort((a, b) => {
            return a.definitionname == b.definitionname ? a.itemname.localeCompare(b.itemname) : a.definitionname.localeCompare(b.definitionname);
        })
    }

    /**
     * close the modal
     */
    public close() {
        this.self.destroy();
    }

}