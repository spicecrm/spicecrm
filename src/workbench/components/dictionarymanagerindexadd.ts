/**
 * @module WorkbenchModule
 */
import {
    Component, Injector, OnInit
} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {backend} from '../../services/backend.service';
import {modal} from '../../services/modal.service';


import {dictionarymanager} from '../services/dictionarymanager.service';
import {
    DictionaryDefinition,
    DictionaryIndex,
    DictionaryIndexItem,
    DictionaryItem
} from "../interfaces/dictionarymanager.interfaces";

/**
 * redners a modal to add an index
 */
@Component({
    templateUrl: '../templates/dictionarymanagerindexadd.html',
})
export class DictionaryManagerIndexAdd implements OnInit{

    /**
     * reference to self
     *
     * @private
     */
    public self: any;

    /**
     * the index to be created
     *
     * @private
     */
    public index: DictionaryIndex;

    /**
     * the list of available index fields
     *
     * @private
     */
    public availableDictionaryItems: DictionaryItem[] = [];

    /**
     * for the foreign key
     */
    public dictionaryItemId: string;
    public dictionaryForeignDefinitionId: string;
    public dictionaryForeignItemId: string;

    /**
     * ther default name set .. to sneure the user changes it
     * @private
     */
    private defaultName: string;

    /**
     * the list of fields in teh index
     *
     * @private
     */
    public indexDictionaryItems: DictionaryItem[] = [];

    constructor(public backend: backend, public modal: modal, public dictionarymanager: dictionarymanager, public injector: Injector, public modelutilities: modelutilities) {

        let tablename = this.dictionarymanager.dictionarydefinitions.find(d => d.id == this.dictionarymanager.currentDictionaryDefinition).tablename;

        this.index = {
            id: this.modelutilities.generateGuid(),
            name: `idx_` + (tablename ? tablename : '{tablename}') + '_',
            sysdictionarydefinition_id: this.dictionarymanager.currentDictionaryDefinition,
            status: 'd',
            scope:  this.dictionarymanager.currentDictionaryScope,
            indextype: 'index'
        };

        // if scope is not all reset to custom in any case


        this.availableDictionaryItems = this.dictionarymanager.getDictionaryDefinitionItems(this.dictionarymanager.currentDictionaryDefinition).sort((a, b) => a.name.localeCompare(b.name));
    }

    get foreignDefinitions(): DictionaryDefinition[]{
        return this.dictionarymanager.dictionarydefinitions.filter(d => d.sysdictionary_type != 'template').sort((a, b) => a.name.localeCompare(b.name))
    }

    /**
     * a getter for the foreign dictioanry items
     */
    get foreignItems(): DictionaryItem[]{
        return this.dictionarymanager.getDictionaryDefinitionItems(this.dictionaryForeignDefinitionId).sort((a, b) => a.name.localeCompare(b.name));
    }

    /**
     * wasier naming for specific index types
     */
    public ngOnInit() {
        switch (this.index.indextype){
            case 'primary':
                this.index.name += 'pk';
                break;
            case 'foreign':
                this.index.name = this.index.name.replace('idx_', 'idx_fk_')
                this.defaultName = this.index.name;
                break;
            default:
                this.defaultName = this.index.name;
                break;
        }


    }

    /**
     * close the modal
     *
     * @private
     */
    public close() {
        this.self.destroy();
    }

    get canAdd(){
        // name needs to be set
        if(!this.index.name) return false;

        // check that the name has been changed
        if(this.index.name == this.defaultName) return false;

        // name needs to be unique
        if(this.dictionarymanager.dictionaryindexes.filter(i => i.name == this.index.name && (this.dictionarymanager.getCurrentDefinition().sysdictionary_type != 'template' || this.dictionarymanager.currentDictionaryDefinition == i.sysdictionarydefinition_id)).length > 0) return false;

        // for non-foreign we need to have fields
        if(this.index.indextype != 'foreign' && this.indexDictionaryItems.length == 0) return false;

        // for foregin we need to have the remote field
        if(this.index.indextype == 'foreign' && (!this.dictionaryItemId || !this.dictionaryForeignItemId)) return false;

        return true;
    }

    /**
     * add the index and the items
     *
     * @private
     */
    public add() {
        let indexItems: DictionaryIndexItem[] = [];
        switch(this.index.indextype){
            case 'foreign':
                indexItems.push({
                    id: this.modelutilities.generateGuid(),
                    scope: this.index.scope,
                    status: this.index.status,
                    sysdictionaryindex_id: this.index.id,
                    sysdictionaryitem_id: this.dictionaryItemId,
                    sysdictionaryforeigndefinition_id: this.dictionaryForeignDefinitionId,
                    sysdictionaryforeignitem_id: this.dictionaryForeignItemId,
                    sequence: 0
                });
                break;
            default:
                let sequence = 0;
                for(let item of this.indexDictionaryItems){
                    indexItems.push({
                        id: this.modelutilities.generateGuid(),
                        scope: this.index.scope,
                        status: this.index.status,
                        sysdictionaryindex_id: this.index.id,
                        sysdictionaryitem_id: item.id,
                        sequence: sequence
                    });
                    sequence++;
                }
                break;
        }

        let saveModal = this.modal.await('LBL_SAVING');
        this.backend.postRequest(`dictionary/index/${this.index.id}`, {}, {index: this.index, items: indexItems}).subscribe({
            next: (res) => {
                this.dictionarymanager.dictionaryindexes.push({...this.index});
                indexItems.forEach(i => this.dictionarymanager.dictionaryindexitems.push(i));
                saveModal.emit(true);
                this.close();
            },
            error: () => {
                // do some rollback
                saveModal.emit(true);
            }
        })
    }

    /**
     * for the drop of the field
     *
     * @param event
     */
    public onFieldDrop(event) {
        let previousItem = event.previousContainer.data.splice(event.previousIndex, 1);
        event.container.data.splice(event.currentIndex, 0, previousItem[0]);
    }


}
