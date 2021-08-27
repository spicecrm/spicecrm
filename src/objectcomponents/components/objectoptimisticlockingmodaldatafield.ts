/**
 * @module ObjectComponents
 */
import {Component, Input, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';

@Component({
    selector: 'object-optimisitclocking-modal-data-field',
    templateUrl: './src/objectcomponents/templates/objectoptimisticlockingmodaldatafield.html',
    providers: [model]
})
export class ObjectOptimisticLockingModalDataField implements OnInit {

    @Input() private fieldname: string = '';
    @Input() private fieldmodule: string = '';
    @Input() private fieldvalue: any;

    constructor(private model: model) {
    }

    public ngOnInit() {
        this.model.module = this.fieldmodule;
        this.model.setField(this.fieldname, this.fieldvalue);
    }

}
