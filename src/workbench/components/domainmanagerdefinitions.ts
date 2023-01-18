/**
 * @module WorkbenchModule
 */
import {
    Component, Injector
} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {backend} from '../../services/backend.service';
import {broadcast} from '../../services/broadcast.service';
import {toast} from '../../services/toast.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {modal} from '../../services/modal.service';
import {domainmanager} from '../services/domainmanager.service';

/**
 * provides a list of the defined domain definitons .. part of the domain manager
 */
@Component({
    selector: 'domain-manager-definitions',
    templateUrl: '../templates/domainmanagerdefinitions.html',
})
export class DomainManagerDefinitions {

    public definitionfilterterm: string;
    public definitionfilterscope: ''|'g'|'c' = '';
    public definitionfilterstatus: ''|'i' | 'd' | 'a' = '';

    constructor(public domainmanager: domainmanager, public backend: backend, public metadata: metadata, public language: language, public modelutilities: modelutilities, public broadcast: broadcast, public toast: toast, public modal: modal, public injector: Injector) {

    }

    /**
     * returns the filtered definitions
     */
    get domaindefinitions() {
        return this.domainmanager.domaindefinitions.filter(d => {
            // no deleted
            if (d.deleted) return false;
            // match name if set
            if(this.definitionfilterterm && !(d.name.toLowerCase().indexOf(this.definitionfilterterm.toLowerCase()) >= 0)) return false;
            // if scope is set apply scope Filter
            if(this.definitionfilterscope != '' && d.scope != this.definitionfilterscope) return false;
            // if scope is set apply status Filter
            if(this.definitionfilterstatus != '' && d.status != this.definitionfilterstatus) return false;
            // else return true
            return true;
        }).sort((a, b) => a.name > b.name ? 1 : -1);
    }


    public trackByFn(index, item) {
        return item.id;
    }


    public setCurrentDomainDefintion(definitionId: string) {
        this.domainmanager.currentDomainDefinition = definitionId;
        this.domainmanager.currentDomainField = null;
    }

    /**
     * react to the click to add a new domain definition
     */
    public addDomainDefinition(event: MouseEvent) {
        event.stopPropagation();
        this.modal.openModal('DomainManagerAddDefinitionModal', true, this.injector);
    }

    /**
     * prompts the user and delets the domain definition
     *
     * @param event
     * @param id
     */
    public deleteDomainDefinition(event: MouseEvent, id: string) {
        event.stopPropagation();
        this.modal.prompt('confirm', this.language.getLabel('MSG_DELETE_RECORD', '', 'long'), this.language.getLabel('MSG_DELETE_RECORD')).subscribe(answer => {
            if (answer) {
                let di = this.domainmanager.domaindefinitions.find(f => f.id == id).deleted = 1;

                for (let f of this.domainmanager.domainfields.filter(f => f.sysdomaindefinition_id == id)) {
                    f.deleted = 1;
                }

                if (this.domainmanager.currentDomainDefinition == id) {
                    this.domainmanager.currentDomainDefinition == null;
                    this.domainmanager.currentDomainField == null;
                }
            }
        });
    }

}
