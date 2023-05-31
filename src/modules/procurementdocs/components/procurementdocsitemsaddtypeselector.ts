/**
 * @module ModuleProcurementDocs
 */
import {OnInit, Component, EventEmitter, Output} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {configurationService} from '../../../services/configuration.service';
import {model} from '../../../services/model.service';

@Component({
    selector: 'procurement-docs-items-add-type-selector',
    templateUrl: '../templates/procurementdocsitemsaddtypeselector.html'
})
export class ProcurementDocsItemsAddTypeSelector implements OnInit {

    /**
     * reference to self for the modal to allow closing the modal
     */
    public self: any = undefined;

    /**
     * an eventEmitter for the selected item type
     */
    @Output() public itemTypeSelected: EventEmitter<any> = new EventEmitter<any>();

    /**
     * the types that match the model available types
     */
    public availableItemTypes: any[] = [];

    /**
     * the selected item type
     */
    public itemType: string = '';

    constructor(public metadata: metadata,
                public language: language,
                public model: model,
                public configuration: configurationService) {
    }

    public ngOnInit() {
        let typesData = this.configuration.getData('procurementdoctypes').find(typeRecord => typeRecord.name == this.model.getField('procurementdoctype'));
        let itemTypesData = this.configuration.getData('procurementdocitemtypes');
        if (typesData) {
            // set the available types
            for (let availableItemType of typesData.itemtypes) {
                let itemTypeDetails = itemTypesData.find(a => a.name == availableItemType);
                if (itemTypeDetails) {
                    this.availableItemTypes.push(itemTypeDetails);
                    if (!this.itemType) {
                        this.itemType = itemTypeDetails.name;
                    }
                }
            }
        } else {
            this.availableItemTypes = [];
        }

        // if we only have one item .. emit this right away and do not prompt the user
        if (this.availableItemTypes.length == 1) {
            this.add();
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
