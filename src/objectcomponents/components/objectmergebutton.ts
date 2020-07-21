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
    templateUrl: './src/objectcomponents/templates/objectmergebutton.html'
})
export class ObjectMergeButton {

    /**
     * the models idefntified as duplicates
     */
    @Input() private mergemodels: any[];

    /**
     * an event emitter the panel can subscribe to
     */
    @Output() private merged: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private language: language, private metadata: metadata, private model: model, private modal: modal, private injector: Injector) {

    }

    /**
     * execute the merge
     */
    private doMerge() {
        this.modal.openModal('ObjectMergeModal', true, this.injector).subscribe(componentRef =>{
            componentRef.instance.mergemodels = this.mergemodels;
            componentRef.instance.merged$.subscribe(merged => {
                this.merged.emit(merged);
            });
        });
    }


}
