/**
 * @module ObjectComponents
 */
import {Component, Input, OnInit} from '@angular/core';
import {model} from '../../../services/model.service';
import {modellist} from '../../../services/modellist.service';

@Component({
    selector: 'object-merge-modal-data-field',
    templateUrl: '../templates/objectmergemodaldatafield.html',
    providers: [model]
})
export class ObjectMergeModalDataField implements OnInit {

    /**
     * the name of the field
     * @private
     */
    @Input() public fieldname: string = '';

    /**
     * config of the field
     * @private
     */
    @Input() public fieldConfig: {fieldtype?: string, key?: string};

    /**
     * the data of the field
     * @private
     */
    @Input() public fielddata: any = {};

    constructor(public model: model, public modellist: modellist) {
        this.model.module = this.modellist.module;
    }

    public ngOnInit() {
        this.model.setData(this.fielddata, false);
    }

}
