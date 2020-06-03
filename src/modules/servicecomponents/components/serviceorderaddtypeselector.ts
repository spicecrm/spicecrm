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
    templateUrl: './src/modules/servicecomponents/templates/serviceorderaddtypeselector.html'
})
export class ServiceOrderAddTypeSelector {

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
    public availableItemTypes: Array<{ id: number, name: string, vname: string}> = [
        { id: 0, name: "Products", vname: "LBL_PRODUCTS" },
        { id: 1, name: "ProductVariants", vname: "LBL_PRODUCTVARIANTS" }
    ];

    /**
     * the selected item type
     */
    private itemType: string = '';

    constructor(private metadata: metadata, private language: language, private model: model, private configuration: configurationService) {

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
