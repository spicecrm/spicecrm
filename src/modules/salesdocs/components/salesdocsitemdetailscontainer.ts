/**
 * @module ModuleSalesDocs
 */
import {
    Component,
    ElementRef,
    Input, OnInit
} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {configurationService} from '../../../services/configuration.service';
import {userpreferences} from '../../../services/userpreferences.service';

@Component({
    selector: 'salesdocs-item-details-container',
    templateUrl: '../templates/salesdocsitemdetailscontainer.html',
    providers: [model]
})
export class SalesDocsItemDetailsContainer implements OnInit {

    /**
     * the item to be displayed
     */
    @Input() public item: any = {};

    public detailcomponentset: string;

    constructor(public language: language,  public model: model, public view: view, public configuration: configurationService) {

    }

    public ngOnInit(): void {
        this.model.module = 'SalesDocItems';
        this.model.id = this.item.id;
        this.model.data = this.model.utils.backendModel2spice(this.model.module, this.item);

        // determine if we have a detail component set to be rendered
        let itemTypes = this.configuration.getData('salesdocitemtypes');
        let itemTypeDetails = itemTypes.find(thisItemType => thisItemType.name == this.item.itemtype);
        if(itemTypeDetails && itemTypeDetails.detailcomponentset) this.detailcomponentset = itemTypeDetails.detailcomponentset;

    }



}
