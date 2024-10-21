/**
 * @module ModuleSalesDocs
 */
import {
    Component,
    ElementRef,
    Input, OnInit, SkipSelf
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
    providers: [model, view]
})
export class SalesDocsItemDetailsContainer implements OnInit {

    /**
     * the item to be displayed
     */
    @Input() public item: any = {};


    /**
     * the salesdoc model
     */
    @Input() public salesdoc: any;

    public detailcomponentset: string;

    constructor(
        public language: language,
        public model: model,
        public view: view,
        @SkipSelf() public parentview: view,
        public configuration: configurationService
    ) {

    }

    public ngOnInit(): void {
        this.model.module = 'SalesDocItems';
        this.model.id = this.item.id;
        this.model.initialize();
        this.model.setData(this.item);

        // link the two views
        this.view.isEditable = this.parentview.isEditable;
        this.parentview.mode$.subscribe(mode => {
            // check if we are in the same mode already
            if (this.view.getMode() == mode) return;

            // process the mode change
            if (mode == 'edit') {
                this.view.setEditMode();
                this.view.displayLinks = false;
            } else {
                this.view.setViewMode();
                this.view.displayLinks = true;
            }
        });

        this.view.mode$.subscribe(mode => {
            // check if we are in the same mode already
            if (this.parentview.getMode() == mode) return;

            // process the mode change
            if (mode == 'edit') {
                // start editing the Salesdoc
                this.salesdoc.startEdit();
                // set the view to edit mode
                this.parentview.setEditMode();

                // do not display links
                this.view.displayLinks = false;
            }
        });

        // determine if we have a detail component set to be rendered
        let itemTypes = this.configuration.getData('salesdocitemtypes');
        let itemTypeDetails = itemTypes.find(thisItemType => thisItemType.name == this.item.itemtype);
        if(itemTypeDetails && itemTypeDetails.detailcomponentset) this.detailcomponentset = itemTypeDetails.detailcomponentset;

    }



}
