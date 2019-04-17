/**
 * @module ObjectComponents
 */
import {Component, OnInit} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'object-action-edit-button',
    templateUrl: './src/objectcomponents/templates/objectactioneditbutton.html'
})
export class ObjectActionEditButton implements OnInit {

    public disabled: boolean = true;

    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
    ) {

    }

    public ngOnInit() {
        this.handleDisabled(this.model.isEditing ? 'edit' : 'display');
        this.model.mode$.subscribe(mode => {
            this.handleDisabled(mode);
        });

        this.model.data$.subscribe(data => {
            this.handleDisabled(this.model.isEditing ? 'edit' : 'display');
        });
    }

    public execute() {
        this.model.edit();
    }

    private handleDisabled(mode) {
        if (this.model.data.acl && !this.model.checkAccess('edit')) {

            this.disabled = true;
            return;
        }
        this.disabled = mode == 'edit' ? true : false;
    }

}
