/**
 * @module ObjectFields
 */
import {Component, Injector} from '@angular/core';
import {Router} from '@angular/router';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {modal} from '../../../services/modal.service';
import {fieldGeneric} from "../../../objectfields/components/fieldgeneric";

@Component({
    selector: 'field-servicequeue',
    templateUrl: './src/modules/servicecomponents/templates/fieldservicequeue.html'
})
export class fieldServiceQueue extends fieldGeneric {

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, private modal: modal, private injector: Injector) {
        super(model, view, language, metadata, router);
    }
    get canChange() {
        if (this.model.data.acl && !this.model.data.acl.edit) return false;

        let resolveDate = this.model.getField('resolve_date');
        if (resolveDate && resolveDate.isValid && resolveDate.isValid()) {
            return false;
        }

        return this.model.isEditing ? false : true;
    }

    private selectQueue() {
        if(this.canChange) {
            this.modal.openModal('ServiceSelectQueueModal', true, this.injector);
        }
    }
}
