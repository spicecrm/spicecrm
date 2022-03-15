/**
 * @module ObjectComponents
 */
import {Component, Input, OnInit} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';

/**
 * renders a fieldset for a model as bullet separated hotizontal list
 * renders only fields that have a value
 */
@Component({
    selector: 'object-record-fieldset-horizontal-list',
    templateUrl: '../templates/objectrecordfieldsethorizontallist.html'
})
export class ObjectRecordFieldsetHorizontalList implements OnInit {

    /**
     * the fieldset to be rendered
     */
    @Input() public fieldset: string = '';

    /**
     * the fieldset items
     */
    public fieldsetitems: any[] = [];

    constructor(public metadata: metadata, public model: model) {
    }

    /**
     * get the fieldsetitems on init
     */
    public ngOnInit() {
        this.fieldsetitems = this.metadata.getFieldSetItems(this.fieldset);
    }

}
