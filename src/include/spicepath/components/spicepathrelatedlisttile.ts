/**
 * @module ModuleSpicePath
 */

import {Component, Input, OnInit} from '@angular/core';
import {model} from '../../../services/model.service';
import {relatedmodels} from '../../../services/relatedmodels.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';


/**
 * renders a tile with the path and the details for the model
 */
@Component({
    selector: 'spice-path-related-list-tile',
    templateUrl: '../templates/spicepathrelatedlisttile.html',
    providers: [model, view]
})
export class SpicePathRelatedListTile implements OnInit {

    /**
     * the module
     */
    @Input() public module: string = '';

    /**
     * the data for the
     */
    @Input() public data: any = {};

    /**
     * the componentset to be rendered
     */
    @Input() public componentset: string = '';

    /**
     * the componentconfig
     */
    public componentconfig: any = {};

    constructor(public model: model, public relatedmodels: relatedmodels, public view: view, public language: language, public metadata: metadata) {
    }

    /**
     * initialize the model
     */
    public ngOnInit() {
        this.model.module = this.module;
        this.model.id = this.data.id;
        this.model.setData(this.data);

        this.componentconfig = this.metadata.getComponentConfig('SpicePathRelatedListTile', this.module);
    }

    /**
     * getter for the actionset
     */
    get actionset() {
        return this.componentconfig.actionset;
    }

    /**
     * getter for the left componentset
     */
    get componentSetLeft() {
        return this.componentconfig.left;
    }

    /**
     * getter for the right componentset
     */
    get componentSetRight() {
        return this.componentconfig.right;
    }

}
