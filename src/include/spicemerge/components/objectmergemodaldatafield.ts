/**
 * @module ObjectComponents
 */
import {Component, Input, OnInit} from '@angular/core';
import {model} from '../../../services/model.service';
import {modellist} from '../../../services/modellist.service';

@Component({
    selector: 'object-merge-modal-data-field',
    templateUrl: './src/include/spicemerge/templates/objectmergemodaldatafield.html',
    providers: [model]
})
export class ObjectMergeModalDataField implements OnInit {

    @Input() private fieldname: string = '';
    @Input() private fielddata: any = {};

    constructor(private model: model, private modellist: modellist) {
        this.model.module = this.modellist.module;

    }

    public ngOnInit() {
        this.model.data = this.fielddata;
    }

}
