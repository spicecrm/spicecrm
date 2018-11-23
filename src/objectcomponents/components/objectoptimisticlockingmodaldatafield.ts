import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {modellist} from '../../services/modellist.service';
import {language} from '../../services/language.service';
import {popup} from '../../services/popup.service';

@Component({
    selector: 'object-optimisitclocking-modal-data-field',
    templateUrl: './src/objectcomponents/templates/objectoptimisticlockingmodaldatafield.html',
    providers: [model, view]
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
