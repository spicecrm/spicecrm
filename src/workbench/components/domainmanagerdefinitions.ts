/**
 * @module WorkbenchModule
 */
import {
    Component, Injector, ViewChild, ViewContainerRef
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

    @ViewChild( 'itemscontainer', {read: ViewContainerRef, static: true } ) public itemscontainer: ViewContainerRef;


    public definitionfilterterm: string;
    public definitionfilterscope: ''|'g'|'c' = '';
    public definitionfilterstatus: ''|'i' | 'd' | 'a' = '';

    public definitionsfiltertype: string = ''

    constructor(public domainmanager: domainmanager, public backend: backend, public metadata: metadata, public language: language, public modelutilities: modelutilities, public broadcast: broadcast, public toast: toast, public modal: modal, public injector: Injector) {

    }

    /**
     * returns the filtered definitions
     */
    get domaindefinitions() {
        return this.domainmanager.domaindefinitions.filter(d => {
            // keep the current definition
            if(d.id == this.domainmanager.currentDomainDefinition) return true;
            // match name if set
            if(this.definitionfilterterm && !(d.name.toLowerCase().indexOf(this.definitionfilterterm.toLowerCase()) >= 0)) return false;
            // if scope is set apply scope Filter
            if(this.definitionfilterscope != '' && d.scope != this.definitionfilterscope) return false;
            // if scope is set apply status Filter
            if(this.definitionfilterstatus != '' && d.status != this.definitionfilterstatus) return false;
            // filter by type
            if(this.definitionsfiltertype != '' && d.fieldtype != this.definitionsfiltertype) return false;
            // else return true
            return true;
        }).sort((a, b) => a.name.localeCompare(b.name));
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
        this.modal.openModal('DomainManagerAddDefinitionModal', true, this.injector).subscribe({
            next: (modalRef) => {
                modalRef.instance.newDefinitionID.subscribe({
                    next: (newID) => {
                        this.setCurrentDomainDefintion(newID);
                        let totalScrollHeight = this.itemscontainer.element.nativeElement.scrollHeight;
                        let i = this.domaindefinitions.findIndex(i => i.id == newID);
                        let scrollTo = totalScrollHeight / this.domaindefinitions.length * i;
                        this.itemscontainer.element.nativeElement.scrollTo(0, scrollTo);
                    }
                })
            }
        });
    }

    /**
     * prompts the user and delets the domain definition
     *
     * @param event
     * @param id
     */
    public deleteDomainDefinition(id: string) {
        this.modal.prompt('confirm', this.language.getLabel('MSG_DELETE_RECORD', '', 'long'), this.language.getLabel('MSG_DELETE_RECORD')).subscribe(answer => {
            if (answer) {
                this.backend.deleteRequest(`dictionary/domaindefinition/${id}`).subscribe({
                    next: (res) => {
                        let di = this.domainmanager.domaindefinitions.findIndex(f => f.id == id);
                        this.domainmanager.domaindefinitions.splice(di, 1);
                        if (this.domainmanager.currentDomainDefinition == id) {
                            this.domainmanager.currentDomainDefinition == null;
                            this.domainmanager.currentDomainField == null;
                        }
                    }
                });
            }
        });
    }

    /**
     * toggle the status
     * @param e
     * @param validationValue
     */
    public setStatus(domaindefinition, status) {
        let loadingModal;
        switch (status) {
            case 'a':
                loadingModal = this.modal.await('LBL_EXECUTING');
                this.backend.postRequest(`dictionary/domaindefinition/${domaindefinition.id}/activate`).subscribe({
                    next: () => {
                        domaindefinition.status = status;

                        // set for all fields
                        this.domainmanager.domainfields.filter(f => f.sysdomaindefinition_id == domaindefinition.id).forEach(f => f.status = status);

                        loadingModal.emit(true);
                    },
                    error: () => {
                        loadingModal.emit(true);
                    }
                })
                break;
            case 'i':
                loadingModal = this.modal.await('LBL_EXECUTING');
                this.backend.deleteRequest(`dictionary/domaindefinition/${domaindefinition.id}/activate`).subscribe({
                    next: () => {
                        domaindefinition.status = status;

                        // set for all fields
                        this.domainmanager.domainfields.filter(f => f.sysdomaindefinition_id == domaindefinition.id).forEach(f => f.status = status);

                        loadingModal.emit(true);
                    },
                    error: () => {
                        loadingModal.emit(true);
                    }
                })
                break;
            default:
                domaindefinition.status = status;
                break;
        }
    }

}
