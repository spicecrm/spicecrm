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
    templateUrl: '../templates/serviceorderaddtypeselector.html'
})
export class ServiceOrderAddTypeSelector {

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
    public availableItemTypes: Array<{ id: number, name: string, vname: string}> = [
        { id: 0, name: "Products", vname: "LBL_PRODUCTS" },
        { id: 1, name: "ProductVariants", vname: "LBL_PRODUCTVARIANTS" }
    ];

    /**
     * the selected item type
     */
    public itemType: string = '';

    constructor(public metadata: metadata, public language: language, public model: model, public configuration: configurationService) {

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
