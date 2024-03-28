/**
 * @module WorkbenchModule
 */
import {
    Component, EventEmitter, Injector, Output, ViewChild, ViewContainerRef
} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {backend} from '../../services/backend.service';
import {modal} from '../../services/modal.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';


import {dictionarymanager} from '../services/dictionarymanager.service';
import {DictionaryDefinition} from "../interfaces/dictionarymanager.interfaces";

/**
 * list the available dictionary definitions
 */
@Component({
    selector: 'dictionary-manager-definitions',
    templateUrl: '../templates/dictionarymanagerdefinitions.html',
})
export class DictionaryManagerDefinitions {

    @ViewChild( 'itemscontainer', {read: ViewContainerRef, static: true } ) public itemscontainer: ViewContainerRef;

    /**
     * a filter term to filter the list by
     *
     * @private
     */
    public definitionfilterterm: string;

    /**
     * a type to filter the list by
     *
     * @private
     */
    public definitionfiltertype: string = '';
    /**
     * a filter for the scopes
     */
    public definitionfilterscope: ''|'g'|'c' = '';
    /**
     * a filter fot the status
     */
    public definitionfilterstatus: ''|'i' | 'd' | 'a' = '';

    /**
     * for loading spinner in repair button
     */
    public repairing: boolean = false;

    public _isExpanded: boolean = false;

    @Output() public expanded: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(public dictionarymanager: dictionarymanager,
                public metadata: metadata,
                public language: language,
                public modal: modal,
                public injector: Injector,
                public modelutilities: modelutilities,
                public backend: backend) {

    }

    get isExpanded(){
        return this._isExpanded;
    }

    set isExpanded(value){
        this._isExpanded = value;
        this.expanded.emit(this._isExpanded);
    }

    /**
     * gets all non deleted entries sorted by name
     */
    get dictionarydefinitions(): DictionaryDefinition[] {

        return this.dictionarymanager.dictionarydefinitions.filter(d => {
            // always leave the current selected visible
            if(d.id == this.dictionarymanager.currentDictionaryDefinition) return true;
            // no empty name (workaround for now)
            if(!d.name) return false;
            // if we have a type filter apply it
            if(this.definitionfiltertype && d.sysdictionary_type != this.definitionfiltertype) return false;
            // if we have a term filter apply it
            if(this.definitionfilterterm && !(d.name.toLowerCase().indexOf(this.definitionfilterterm.toLowerCase()) >= 0 || (d.tablename && d.tablename.toLowerCase().indexOf(this.definitionfilterterm.toLowerCase()) >= 0))) return false;
            // if scope is set apply scope Filter
            if(this.definitionfilterscope != '' && d.scope != this.definitionfilterscope) return false;
            // if scope is set apply status Filter
            if(this.definitionfilterstatus != '' && d.status != this.definitionfilterstatus) return false;
            // otherwise list it
            return true;
        }).sort((a, b) => a.name.localeCompare(b.name));

    }

    /**
     * sets the status and also cfreates or drops the index
     *
     * @param index
     * @param status
     */
    public setStatus(definition, status){
        let loadingModal;
        switch(status){
            case 'a':
                loadingModal = this.modal.await('LBL_EXECUTING');
                this.backend.postRequest(`dictionary/definition/${definition.id}/activate`).subscribe({
                    next: () => {
                        this.dictionarymanager.handleAfterActivate();
                        // set the def status
                        definition.status = status;
                        // set status for items and indexes
                        this.dictionarymanager.dictionaryitems.filter(i => i.sysdictionarydefinition_id == definition.id && i.status != 'a').forEach(i => i.status = 'a');
                        this.dictionarymanager.dictionaryindexes.filter(i => i.sysdictionarydefinition_id == definition.id && i.status != 'a').forEach(i => i.status = 'a');

                        loadingModal.emit(true);
                    },
                    error: () => {
                        loadingModal.emit(true);
                    }
                })
                break;
            case 'i':
                loadingModal = this.modal.await('LBL_EXECUTING');
                this.backend.deleteRequest(`dictionary/definition/${definition.id}/activate`).subscribe({
                    next: () => {
                        this.dictionarymanager.handleAfterActivate();

                        // set the def status
                        definition.status = status;

                        // set status for items and indexes
                        this.dictionarymanager.dictionaryitems.filter(i => i.sysdictionarydefinition_id == definition.id && i.status == 'a').forEach(i => i.status = 'i');
                        this.dictionarymanager.dictionaryindexes.filter(i => i.sysdictionarydefinition_id == definition.id && i.status == 'a').forEach(i => i.status = 'i');

                        loadingModal.emit(true);
                    },
                    error: () => {
                        loadingModal.emit(true);
                    }
                })
                break;
            default:
                definition.status = status;
        }
    }

    public trackByFn(index, item) {
        return item.id;
    }

    /**
     * set the current definition to the service
     *
     * @param definitionId
     */
    public setCurrentDictionaryDefinition(definitionId: string) {
        if(definitionId != this.dictionarymanager.currentDictionaryDefinition) {
            this.dictionarymanager.currentDictionaryDefinition = definitionId;
            // this.dictionarymanager.currentDictionaryScope = scope;
            this.dictionarymanager.currentDictionaryItem = null;
            this.dictionarymanager.currentDictionaryIndex = null;
            this.dictionarymanager.currentDictionaryRelationship = null;
            this.dictionarymanager.loadDatabaseFields(this.dictionarymanager.dictionarydefinitions.find(d => d.id == definitionId).tablename);
        }
    }



    /**
     * react to the click to add a new dictionary definition
     */
    public addDictionaryDefinition(event: MouseEvent) {
        event.stopPropagation();
        this.modal.openModal('DictionaryManagerAddDefinitionModal', true, this.injector).subscribe({
            next: (modalRef) => {
                modalRef.instance.newDefinitionID.subscribe({
                    next: (newID) => {
                        this.setCurrentDictionaryDefinition(newID);
                        let totalScrollHeight = this.itemscontainer.element.nativeElement.scrollHeight;
                        let i = this.dictionarydefinitions.findIndex(i => i.id == newID);
                        let scrollTo = totalScrollHeight / this.dictionarydefinitions.length * i;
                        this.itemscontainer.element.nativeElement.scrollTo(0, scrollTo);
                    }
                })
            }
        });
    }

    /**
     * prompts the user and delets the dictionary definition
     *
     * @param event
     * @param id
     */
    public delete(id: string) {

        this.dictionarymanager.promptDelete('MSG_DELETE_DEFINITION').subscribe({
            next: (response) => {
                let params: any = {};
                if(response == 'drop') params.drop = 1;
                let deleteModal =  this.modal.await('LBL_DELETING');
                this.backend.deleteRequest(`dictionary/definition/${id}`, params).subscribe({
                    next: () => {
                        if (this.dictionarymanager.currentDictionaryDefinition == id) {
                            this.dictionarymanager.currentDictionaryDefinition == null;
                        }

                        // delete the entry
                        let di = this.dictionarymanager.dictionarydefinitions.findIndex(f => f.id == id);
                        this.dictionarymanager.dictionarydefinitions.splice(di, 1);

                        // delete the items
                        this.dictionarymanager.dictionaryitems.filter(i => i.sysdictionarydefinition_id == id).forEach(i => this.dictionarymanager.dictionaryitems.splice(this.dictionarymanager.dictionaryitems.indexOf(i), 1));
                        this.dictionarymanager.dictionaryindexes.filter(i => i.sysdictionarydefinition_id == id).forEach(i => this.dictionarymanager.dictionaryindexes.splice(this.dictionarymanager.dictionaryindexes.indexOf(i), 1));

                        deleteModal.emit(true);
                    },
                    error: () => {
                        deleteModal.emit(true);
                    }
                })
            }
        })
    }

    /**
     * open edit dictionary definition
     */
    public editDictionaryDefinition(definition: DictionaryDefinition) {

        this.modal.openModal('DictionaryManagerEditDefinitionModal', true, this.injector).subscribe(modalRef => {
            modalRef.instance.dictionarydefinition = definition;
        });
    }

}
