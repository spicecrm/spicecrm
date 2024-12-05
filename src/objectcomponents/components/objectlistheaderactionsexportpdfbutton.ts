/**
 * @module ObjectComponents
 */

import {Component, Injector, Input} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {modellist} from '../../services/modellist.service';
import {modal} from '../../services/modal.service';
import {backend} from "../../services/backend.service";
import {Subscription} from "rxjs";


@Component({
    selector: 'object-list-header-actions-export-pdf-button',
    templateUrl: '../templates/objectlistheaderactionsexportpdfbutton.html',
})
export class ObjectListHeaderActionsExportPdfButton {

    /**
     * if there are existing templates for the give module, display the action
     */
    public hidden: boolean = true;

    public subscription: Subscription = new Subscription();

    constructor(
        public language: language,
        public metadata: metadata,
        public model: model,
        public modellist: modellist,
        public modal: modal,
        public backend: backend,
        public injector: Injector
    ) {
    }

    ngOnInit() {
        this.subscription = this.backend.getRequest('module/OutputTemplates/formodule/' + this.modellist.module, {}).subscribe(res => {
            if(res.length > 0) {
                this.hidden = false;
            }
        })
    }

    get disabled() {
        return !this.metadata.checkModuleAcl(this.model.module, 'delete') || this.modellist.getSelectedCount() < 1;
    }

    get selectedCount() {
        return this.modellist.getSelectedCount();
    }

    public execute() {
        if(!this.disabled) {
            this.modal.openModal('ObjectActionOutputPdfModal', true, this.injector);
        }
    }

    public ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}

