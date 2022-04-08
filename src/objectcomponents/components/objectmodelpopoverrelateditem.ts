/**
 * @module ObjectComponents
 */
import {Component, Input} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {metadata} from '../../services/metadata.service';
import {language} from "../../services/language.service";

@Component({
    selector: 'object-model-popover-related-item',
    templateUrl: '../templates/objectmodelpopoverrelateditem.html',
    providers: [model, view]
})
export class ObjectModelPopoverRelatedItem {

    @Input() public module: string = '';
    @Input() public item: any = {};
    @Input() public fields: any[] = [];

    constructor(
        public language: language,
        public metadata: metadata,
        public model: model,
        public view: view
    ) {
        this.view.displayLabels = false;
    }

    public ngOnInit() {
        this.model.module = this.module;
        this.model.id = this.item.id;
        this.model.setData(this.item);
    }

    public goDetail() {
        this.model.goDetail();
    }

}
