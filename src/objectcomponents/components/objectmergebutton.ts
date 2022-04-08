/**
 * @module ObjectComponents
 */
import {Component, Input, Output, EventEmitter, Injector} from '@angular/core';

import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {modal} from '../../services/modal.service';

@Component({
    selector: 'object-merge-button',
    templateUrl: '../templates/objectmergebutton.html'
})
export class ObjectMergeButton {

    /**
     * the models idefntified as duplicates
     */
    @Input() public mergemodels: any[];

    /**
     * an event emitter the panel can subscribe to
     */
    @Output() public merged: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(public language: language, public metadata: metadata, public model: model, public modal: modal, public injector: Injector) {

    }

    /**
     * returns if the button shoudl be enabled
     */
    get enabled() {
        return this.mergemodels?.length > 0 && this.model.checkAccess('edit') && this.mergemodels.filter(d => d.acl?.delete == true).length > 0;
    }

    /**
     * execute the merge
     */
    public doMerge() {
        this.modal.openModal('ObjectMergeModal', true, this.injector).subscribe(componentRef => {
            componentRef.instance.mergemodels = this.mergemodels;
        });
    }
}
