/**
 * @module ObjectFields
 */
import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {metadata} from '../../services/metadata.service';

@Component({
    selector: 'field-linked-details',
    templateUrl: '../templates/fieldlinkeddetails.html',
    providers: [model, view]
})
export class fieldLinkedDetails implements OnInit, OnChanges {

    @Input() public data: any;
    @Input() public module: any;
    @Input() public fieldset: any;

    public fieldsetitems: any[] = [];

    constructor(
        public model: model,
        public view: view,
        public metadata: metadata
    ) {

    }

    public ngOnInit() {

        this.fieldsetitems = this.metadata.getFieldSetFields(this.fieldset, this.module);

        this.view.isEditable = false;
        this.view.displayLabels = false;

    }

    public ngOnChanges(changes: SimpleChanges) {
        this.model.module = this.module;
        this.model.id = this.data.id;
        this.model.setData(this.data);
    }

}
