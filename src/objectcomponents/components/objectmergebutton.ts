import {Component, Input, Output, EventEmitter} from '@angular/core';

import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {modal} from '../../services/modal.service';

@Component({
    selector: 'object-merge-button',
    templateUrl: './src/objectcomponents/templates/objectmergebutton.html'
})
export class ObjectMergeButton {

    @Input() mergemodels: Array<any>;
    @Output() merged: EventEmitter<boolean> = new EventEmitter<boolean>();

    showDialog: boolean = false;

    constructor(private language: language, private metadata: metadata, private model: model, private modal: modal) {

    }

    doMerge() {
        this.modal.openModal('ObjectMergeModal').subscribe(componentRef =>{
            componentRef.instance.parentmodel = this.model;
            componentRef.instance.mergemodels = this.mergemodels;
            componentRef.instance.merged$.subscribe(merged => {
                this.merged.emit(merged);
            })
        })
    }


}