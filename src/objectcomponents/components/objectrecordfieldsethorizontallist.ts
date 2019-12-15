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
    templateUrl: './src/objectcomponents/templates/objectrecordfieldsethorizontallist.html'
})
export class ObjectRecordFieldsetHorizontalList implements OnInit {

    /**
     * the fieldset to be rendered
     */
    @Input() private fieldset: string = '';

    /**
     * the fieldset items
     */
    private fieldsetitems: any[] = [];

    constructor(private metadata: metadata, private model: model) {
    }

    /**
     * get the fieldsetitems on init
     */
    public ngOnInit() {
        this.fieldsetitems = this.metadata.getFieldSetItems(this.fieldset);
    }

}
