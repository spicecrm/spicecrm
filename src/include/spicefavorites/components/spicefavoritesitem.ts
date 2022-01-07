/**
 * @module GlobalComponents
 */
import {
    AfterViewInit, ComponentFactoryResolver, Component, Input, NgModule, ViewChild, ViewContainerRef, EventEmitter,
    OnInit, Output
} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {favorite} from '../../../services/favorite.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';

@Component({
    selector: 'spice-favorites-item',
    templateUrl: '../templates/spicefavoritesitem.html',
    providers: [model, view]
})
export class SpiceFavoritesItem implements OnInit {

    /**
     * thjt eitem that is passed in with the data for the favorite
     */
    @Input() public item: any = {};

    /**
     * the main fieldset that is rendered in the upper line. If none is found teh summary_text is rendered
     */
    public mainfieldset: string;

    /**
     * the sub fieldset rendered in the sub-line
     */
    public subfieldsetfields: any[];

    constructor(public model: model, public language: language, public metadata: metadata, public view: view, public favorite: favorite) {
        this.view.displayLabels = false;
    }

    /**
     * initialize the model and load the config
     */
    public ngOnInit() {
        // initialize the moedl
        this.initializeModel();

        // load the config
        this.loadConfig();

    }

    /**
     * initializes the model from the input item
     */
    public initializeModel() {
        this.model.module = this.item.module_name;
        this.model.id = this.item.item_id;
        this.model.setData(this.item.data);
    }

    /**
     * loads the componentconfig and sets the variables
     */
    public loadConfig() {

        // get the fieldconfig
        let componentconfig = this.metadata.getComponentConfig('GlobalHeaderSearchResultsItem', this.model.module);

        this.mainfieldset = componentconfig.mainfieldset;
        if (componentconfig && componentconfig.subfieldset) this.subfieldsetfields = this.metadata.getFieldSetItems(componentconfig.subfieldset);
    }

    /**
     * delete favorite
     */
    public deleteFavorite() {
        this.favorite.deleteFavorite(this.model.module, this.model.id);
    }
}
