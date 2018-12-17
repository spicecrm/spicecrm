import {Component} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {modal} from '../../services/modal.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';

@Component({
    selector: 'field-servicequeue',
    templateUrl: './src/objectfields/templates/fieldservicequeue.html'
})
export class fieldServiceQueue extends fieldGeneric {

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, private modal: modal) {
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
            this.modal.openModal('ServiceSelectQueueModal').subscribe(
                cmp => {
                    cmp.instance.parentqueue_id = this.model.getField(this.metadata.getFieldDefs(this.model.module, this.fieldname).id_name);
                    cmp.instance.displaynote = !this.view.isEditMode();
                    cmp.instance.selectedqueue.subscribe(response => {
                        if (response != false) {
                            this.model.setField(this.metadata.getFieldDefs(this.model.module, this.fieldname).id_name, response.servicequeue_id);
                            this.model.setField(this.fieldname, response.servicequeue_name);

                            if (!this.model.isEditing) {
                                this.model.save();
                            }
                        }
                    });
                }
            );
        }
    }
}
