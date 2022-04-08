/**
 * @module ObjectComponents
 */
import {Component, Input, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';

@Component({
    selector: 'object-optimisitclocking-modal-data-field',
    templateUrl: '../templates/objectoptimisticlockingmodaldatafield.html',
    providers: [model]
})
export class ObjectOptimisticLockingModalDataField implements OnInit {

    @Input() public fieldname: string = '';
    @Input() public fieldmodule: string = '';
    @Input() public fieldvalue: any;

    constructor(public model: model) {
    }

    public ngOnInit() {
        this.model.module = this.fieldmodule;
        this.model.setField(this.fieldname, this.fieldvalue);
    }

}
