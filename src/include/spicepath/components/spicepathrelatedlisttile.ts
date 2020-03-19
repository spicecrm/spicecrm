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
    templateUrl: './src/include/spicepath/templates/spicepathrelatedlisttile.html',
    providers: [model, view]
})
export class SpicePathRelatedListTile implements OnInit {

    /**
     * the module
     */
    @Input() private module: string = '';

    /**
     * the data for the
     */
    @Input() private data: any = {};

    /**
     * the componentset to be rendered
     */
    @Input() private componentset: string = '';

    /**
     * the componentconfig
     */
    private componentconfig: any = {};

    constructor(private model: model, private relatedmodels: relatedmodels, private view: view, private language: language, private metadata: metadata) {
    }

    /**
     * initialize the model
     */
    public ngOnInit() {
        this.model.module = this.module;
        this.model.id = this.data.id;
        this.model.data = this.data;

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
