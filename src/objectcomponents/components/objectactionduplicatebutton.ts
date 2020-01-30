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
    templateUrl: './src/objectcomponents/templates/objectactionduplicatebutton.html',
    providers: [model]
})
export class ObjectActionDuplicateButton implements OnInit {

    public disabled: boolean = true;

    constructor(@SkipSelf() private parent: model, private language: language, private metadata: metadata, private model: model, private session: session) {

    }

    public ngOnInit() {
        this.disabled = this.metadata.checkModuleAcl(this.model.module, 'create') ? true : false;
    }

    public execute() {
        let newId = this.model.utils.generateGuid();
        this.model.module = this.parent.module;
        this.model.id = newId;
        this.model.isNew = true;
        this.model.data = JSON.parse(JSON.stringify(this.parent.data));
        this.model.data.id = newId;
        this.model.data.assigned_user_id = this.session.authData.userId;
        this.model.data.assigned_user_name = this.session.authData.userName;
        this.model.data.modified_by_id = this.session.authData.userId;
        this.model.data.modified_by_name = this.session.authData.userName;
        this.model.data.date_entered = new Date();
        this.model.data.date_modified = new Date();

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
