/**
 * @module ObjectComponents
 */
import {Component, OnInit, SkipSelf} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {session} from '../../services/session.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'object-action-duplicate-button',
    templateUrl: '../templates/objectactionduplicatebutton.html',
    providers: [model]
})
export class ObjectActionDuplicateButton {

    constructor(@SkipSelf() public parent: model, public language: language, public metadata: metadata, public model: model, public session: session) {

    }
    /**
     * hide the button while the model is editing
     */
    get hidden() {
        return this.parent.isEditing;
    }

    /**
     * set to dsiabled when we are not allowed to edit or we are editing or saving already
     */
    get disabled() {
        if (!this.metadata.checkModuleAcl(this.parent.module, 'create')) {
            return true;
        }
        return this.parent.isEditing || this.parent.isSaving;
    }

    public execute() {
        let newId = this.model.utils.generateGuid();
        this.model.module = this.parent.module;
        this.model.initializeModel();

        // generate the new model data from the model to be cloned
        let modelData = JSON.parse(JSON.stringify(this.parent.data));
        modelData.id = this.model.id;
        modelData.assigned_user_id = this.session.authData.userId;
        modelData.assigned_user_name = this.session.authData.userName;
        modelData.modified_by_id = this.session.authData.userId;
        modelData.modified_by_name = this.session.authData.userName;
        modelData.date_entered = new Date();
        modelData.date_modified = new Date();

        this.model.setData(modelData, false);

        for (let field in this.parent.fields) {
            if (this.parent.fields[field].type == 'link' && this.model.data[field] && this.model.data[field].beans) {
                for (let bean in this.model.data[field].beans) {
                    for (let relField in this.model.data[field].beans[bean]) {
                        if (this.model.data[field].beans[bean][relField] == this.parent.id) {
                            this.model.data[field].beans[bean][relField] = newId;
                            this.model.data[field].beans[bean].id = this.model.utils.generateGuid();
                        }

                        // max 1 level
                        if (this.model.data[field].beans[bean][relField].beans) {
                            this.model.data[field].beans[bean][relField].beans = {};
                        }
                    }

                    if (this.model.data[field].beans[bean].id != bean) {
                        this.model.data[field].beans[this.model.data[field].beans[bean].id] = this.model.data[field].beans[bean];
                        delete(this.model.data[field].beans[bean]);
                    }
                }
            }
        }

        // set as duplicate
        this.model.duplicate = true;
        this.model.templateId = this.parent.id;

        this.model.edit();
    }
}
