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

@Component({
    templateUrl: './src/modules/salesdocs/templates/salesdocsitemsaddtypeselector.html'
})
export class SalesDocsItemsAddTypeSelector implements OnInit {

    /**
     * reference to self for the modal to allow closing the modal
     *
     * @type {undefined}
     */
    private self: any = undefined;

    /**
     * an eventEmitter for the selcted item type
     */
    @Output() private itemTypeSelected: EventEmitter<any> = new EventEmitter<any>();

    /**
     * the types that match the model available types
     *
     * @type {Array}
     */
    private availableItemTypes: any[] = [];

    /**
     * the selected item type
     */
    private itemType: string = '';

    constructor(private metadata: metadata, private language: language, private model: model, private configuration: configurationService) {

    }

    public ngOnInit() {
        let typesData = this.configuration.getData('salesdoctypes').find(typeRecord => typeRecord.name == this.model.getField('salesdoctype'));
        let itemTypesData = this.configuration.getData('salesdocitemtypes');
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
    }

    /**
     * close the modal
     */
    private close() {
        this.itemTypeSelected.emit(false);
        this.self.destroy();
    }

    /**
     * add the item type
     */
    private add() {
        this.itemTypeSelected.emit(this.itemType);
        this.self.destroy();
    }
}
