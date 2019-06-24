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

@Component({
    selector: '[object-related-card-tile]',
    templateUrl: './src/objectcomponents/templates/objectrelatedcardtile.html',
    providers: [model, view]
})
export class ObjectRelatedCardTile {

    @Input() private module: string = '';
    @Input() private data: any = {};
    @Input() private fieldset: string = '';
    private addActions = [{action: 'remove', label: 'LBL_UNLINK'}];

    constructor(private model: model, private relatedmodels: relatedmodels, private view: view, private language: language, private metadata: metadata, private router: Router) {
        this.view.displayLabels = false;
    }

    public ngOnInit() {
        this.model.module = this.module;
        this.model.id = this.data.id;
        this.model.data = this.data;
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