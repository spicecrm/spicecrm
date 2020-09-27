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


@Component({
    templateUrl: './src/workbench/templates/domainmanager.html',
    providers: [metadata, domainmanager]
})
export class DomainManager {


    /**
     * the scope for the tabbed view
     */
    private tabScope: 'details' | 'validations' = 'details';

    constructor(private domainmanager: domainmanager, private backend: backend, private metadata: metadata, private language: language, private modelutilities: modelutilities, private broadcast: broadcast, private toast: toast, private modal: modal, private injector: Injector) {


    }

    get domaindefinitions() {
        return this.domainmanager.domaindefinitions.filter(d => d.deleted == 0).sort((a, b) => a.name > b.name ? 1 : -1);
    }

    get domainfields() {
        return this.domainmanager.domainfields;
    }

    get currentField() {
        return this.domainfields.find(field => field.id == this.domainmanager.currentDomainField);
    }

    private setCurrentDomainDefintion(definitionId: string) {
        this.domainmanager.currentDomainDefinition = definitionId;
        this.domainmanager.currentDomainField = null;
    }

    /**
     * react to the click to add a new domain definition
     */
    private addDomainDefinition(event: MouseEvent) {
        event.stopPropagation();
        this.modal.openModal('DomainManagerAddDefinitionModal', true, this.injector);
    }

    /**
     * prompts the user and delets the domain definition
     *
     * @param event
     * @param id
     */
    private deleteDomainDefinition(event: MouseEvent, id: string) {
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

    /**
     * react to the click to add a new domain field
     */
    private addDomainField(event: MouseEvent) {
        event.stopPropagation();
        this.modal.openModal('DomainManagerAddFieldModal', true, this.injector);
    }

    /**
     * prompts the user and delets the domain field
     *
     * @param event
     * @param id
     */
    private deleteDomainField(event: MouseEvent, id: string) {
        event.stopPropagation();
        this.modal.prompt('confirm', this.language.getLabel('MSG_DELETE_RECORD', '', 'long'), this.language.getLabel('MSG_DELETE_RECORD')).subscribe(answer => {
            if (answer) {
                this.domainmanager.domainfields.find(f => f.id == id).deleted = 1;
                if (this.domainmanager.currentDomainField == id) {
                    this.domainmanager.currentDomainField == null;
                }
            }
        });
    }

    /**
     * save the changes if there are any
     */
    private save() {
        this.domainmanager.save();
    }

}
