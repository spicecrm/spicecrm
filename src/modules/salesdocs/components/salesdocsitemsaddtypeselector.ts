/**
 * @module ModuleSalesDocs
 */
import {
    OnInit,
    Component,
    EventEmitter,
    Output
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {configurationService} from '../../../services/configuration.service';
import {model} from '../../../services/model.service';
import {toast} from "../../../services/toast.service";

@Component({
    templateUrl: '../templates/salesdocsitemsaddtypeselector.html'
})
export class SalesDocsItemsAddTypeSelector implements OnInit {

    /**
     * reference to self for the modal to allow closing the modal
     *
     * @type {undefined}
     */
    public self: any = undefined;

    /**
     * an eventEmitter for the selcted item type
     */
    @Output() public itemTypeSelected: EventEmitter<any> = new EventEmitter<any>();

    /**
     * the types that match the model available types
     *
     * @type {Array}
     */
    public availableItemTypes: any[] = [];

    /**
     * the selected item type
     */
    public itemType: string = '';

    /**
     * a property for the parent item type
     */
    public parentItemType: string;

    constructor(public metadata: metadata, public language: language, public model: model, public configuration: configurationService, public toast: toast) {

    }

    public ngOnInit() {
        let typesData = this.configuration.getData('salesdoctypes').find(typeRecord => typeRecord.name == this.model.getField('salesdoctype'));
        let itemTypesData = this.configuration.getData('salesdocitemtypes');
        if (typesData) {
            // set the available types or subitemtypes
            if(!this.parentItemType) {
                for (let availableItemType of typesData.itemtypes) {
                    let itemTypeDetails = itemTypesData.find(a => a.name == availableItemType);
                    if (itemTypeDetails) {
                        this.availableItemTypes.push(itemTypeDetails);
                    }
                }
            } else if(typesData.itemsubtypes[this.parentItemType]){
                for (let availableItemType of typesData.itemsubtypes[this.parentItemType]) {
                    let itemTypeDetails = itemTypesData.find(a => a.name == availableItemType);
                    if (itemTypeDetails) {
                        this.availableItemTypes.push(itemTypeDetails);
                    }
                }
            }
        } else {
            // if we have no itemtypes emit an error and close the dialog
            this.availableItemTypes = [];
            this.toast.sendToast('MSG_NO_ITEMTYPES_CONFIGURED', 'error');
            this.close();
        }

        // sort the array
        this.availableItemTypes.sort((a, b) => this.language.getLabel(a.vname).localeCompare(this.language.getLabel(b.vname)));

        if (!this.itemType) {
            this.itemType = this.availableItemTypes[0].name;
        }

        // if we only have one item .. emit this right away and do not prompt the user
        if (this.availableItemTypes.length == 1 ) {
            this.add();
            return;
        }

    }

    /**
     * close the modal
     */
    public close() {
        this.itemTypeSelected.emit(false);
        this.self.destroy();
    }

    /**
     * add the item type
     */
    public add() {
        this.itemTypeSelected.emit(this.itemType);
        this.self.destroy();
    }
}
