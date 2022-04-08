/**
 * @module ObjectComponents
 */

import {Component, Input} from '@angular/core';
import {model} from '../../services/model.service';
import {relatedmodels} from '../../services/relatedmodels.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {Router} from '@angular/router';

/**
 * renders a tile in the tile panel underneath an object
 */
@Component({
    selector: '[object-related-card-tile]',
    templateUrl: '../templates/objectrelatedcardtile.html',
    providers: [model, view]
})
export class ObjectRelatedCardTile {

    /**
     * trhe data passed in fromn teh related models service
     */
    @Input() public data: any = {};

    /**
     * the fieldset passed in
     */
    @Input() public fieldset: string = '';

    /**
     * the actionset
     */
    public actionset: string;

    /**
     * the fields to be didsplayed
     */
    public fields: any[] = [];

    constructor(public model: model, public relatedmodels: relatedmodels, public view: view, public language: language, public metadata: metadata, public router: Router) {
        this.view.displayLabels = false;
    }

    public ngOnInit() {

        // initialize the model
        this.initalizeModel();

        // load config and set paramaters
        this.loadConfig();
    }

    /**
     * inialize the model
     */
    public initalizeModel(){
        this.model.module = this.relatedmodels.relatedModule;
        this.model.id = this.data.id;
        this.model.setData(this.data);
    }

    /**
     * loads the config (mainly for the actionset
     */
    public loadConfig() {
        let componentconfig = this.metadata.getComponentConfig('ObjectRelatedCardTile', this.model.module);
        this.actionset = componentconfig.actionset;

        this.fields = this.metadata.getFieldSetFields(this.fieldset);
    }

}
