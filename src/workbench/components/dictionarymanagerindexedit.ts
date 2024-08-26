import {Component, Input, OnInit} from "@angular/core";
import {modelutilities} from '../../services/modelutilities.service';
import {backend} from '../../services/backend.service';
import {dictionarymanager} from "../services/dictionarymanager.service";
import {DictionaryDefinition, DictionaryIndex, DictionaryItem} from "../interfaces/dictionarymanager.interfaces";
import {metadata} from "../../services/metadata.service";
import {modal} from "../../services/modal.service";

@Component({
    templateUrl:'../templates/dictionarymanagerindexedit.html',
})
export class DictionaryManagerIndexEdit implements OnInit {

    public self: any;
    @Input() public index: DictionaryIndex;

    public availableDictionaryItems: DictionaryItem[] = [];
    public indexDictionaryItems: DictionaryItem[] = [];
    private originalIndexItems: DictionaryItem[] = []; // To track original items

    public dictionaryItemId: string;
    public dictionaryForeignDefinitionId: string;
    public dictionaryForeignItemId: string;

    constructor( public dictionarymanager: dictionarymanager, public modal: modal, public metadata: metadata, public modelutilities: modelutilities, public backend: backend) {}

    ngOnInit() {
        if (this.index) {
            this.populateItems();
        }
    }

    private populateItems() {
        // Get all items for the current dictionary definition
        const allItems = this.dictionarymanager.getDictionaryDefinitionItems(this.index.sysdictionarydefinition_id)
            .sort((a, b) => a.name.localeCompare(b.name));

        if (this.index.indextype === 'foreign') {
            const foreignItem = this.dictionarymanager.dictionaryindexitems
                .find(item => item.sysdictionaryindex_id === this.index.id);
            if (foreignItem) {
                this.dictionaryItemId = foreignItem.sysdictionaryitem_id;
                this.dictionaryForeignDefinitionId = foreignItem.sysdictionaryforeigndefinition_id;
                this.dictionaryForeignItemId = foreignItem.sysdictionaryforeignitem_id;

                // Ensure the selected item is in availableDictionaryItems
                this.availableDictionaryItems = allItems;
            }
        } else {
            // Existing logic for non-foreign indexes
            const indexItems = this.dictionarymanager.dictionaryindexitems
                .filter(item => item.sysdictionaryindex_id === this.index.id)
                .map(item => allItems.find(i => i.id === item.sysdictionaryitem_id))
                .filter(item => item !== undefined) as DictionaryItem[];

            this.originalIndexItems = [...indexItems];
            this.indexDictionaryItems = indexItems;
            this.availableDictionaryItems = allItems.filter(item =>
                !indexItems.some(indexItem => indexItem.id === item.id)
            );
        }
    }

    public onFieldDrop(event) {
        let previousItem = event.previousContainer.data.splice(event.previousIndex, 1)[0];
        event.container.data.splice(event.currentIndex, 0, previousItem);
    }

    public save() {
        let toSave;
        if (this.index.indextype === 'foreign') {
            toSave = {
                index: {
                    ...this.index,
                    status: this.index.status // Ensure status is included
                },
                items: [{
                    id: this.modelutilities.generateGuid(),
                    scope: this.index.scope,
                    status: this.index.status, // Use the index status
                    sysdictionaryindex_id: this.index.id,
                    sysdictionaryitem_id: this.dictionaryItemId,
                    sysdictionaryforeigndefinition_id: this.dictionaryForeignDefinitionId,
                    sysdictionaryforeignitem_id: this.dictionaryForeignItemId,
                    sequence: 0,
                    version: this.index.version,
                    package: this.index.package
                }]
            };
        } else {
            toSave = {
                index: {...this.index},
                items: this.indexDictionaryItems.map((item, index) => ({
                    id: this.modelutilities.generateGuid(),
                    scope: this.index.scope,
                    status: this.index.status,
                    sysdictionaryindex_id: this.index.id,
                    sysdictionaryitem_id: item.id,
                    sequence: index, // Use index for sequence order
                    version: this.index.version,
                    package: this.index.package
                }))
            }
        }

        let saveModal = this.modal.await('LBL_SAVING');
        this.backend.postRequest(`dictionary/index/${this.index.id}`, {}, toSave).subscribe({
            next: (res) => {
                // Update the index in the manager
                const existingIndex = this.dictionarymanager.dictionaryindexes.findIndex(i => i.id === this.index.id);
                if (existingIndex !== -1) {
                    this.dictionarymanager.dictionaryindexes[existingIndex] = { ...toSave.index };
                } else {
                    this.dictionarymanager.dictionaryindexes.push({ ...toSave.index });
                }

                // Update dictionary items
                this.dictionarymanager.dictionaryindexitems = this.dictionarymanager.dictionaryindexitems.filter(
                    item => item.sysdictionaryindex_id !== this.index.id
                ).concat(toSave.items);

                saveModal.emit(true);
                saveModal.complete();
                this.close();
            },
            error: () => {
                saveModal.emit(true);
                saveModal.complete();
            }
        });
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

    public close() {
        this.self.destroy();
    }
}
