/**
 * @module ModuleSpicePath
 */

import {Component, Input, OnInit} from '@angular/core';
import {model} from '../../../services/model.service';
import {relatedmodels} from '../../../services/relatedmodels.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';

@Component({
    selector: 'spice-path-related-list-tile',
    templateUrl: './src/include/spicepath/templates/spicepathrelatedlisttile.html',
    providers: [model, view]
})
export class SpicePathRelatedListTile implements OnInit {

    @Input() private module: string = '';
    @Input() private data: any = {};
    @Input() private fieldset: string = '';

    private componentconfig: any = {};

    private addActions = [{action: 'remove', name: 'Remove'}];

    constructor(private model: model, private relatedmodels: relatedmodels, private view: view, private language: language, private metadata: metadata) {

    }

    public ngOnInit() {
        this.model.module = this.module;
        this.model.id = this.data.id;
        this.model.data = this.data;

        this.componentconfig = this.metadata.getComponentConfig('SpicePathRelatedListTile', this.module);
    }

    get componentSetLeft() {
        return this.componentconfig.left;
    }

    get componentSetRight() {
        return this.componentconfig.right;
    }

    private getFields() {
        return this.metadata.getFieldSetFields(this.fieldset)
    }

    private navgiateDetail() {
        this.model.goDetail();
    }

    private handleAction(event) {
        switch (event) {
            case 'remove':
                this.relatedmodels.deleteItem(this.model.id);
                break;
        }
    }
}