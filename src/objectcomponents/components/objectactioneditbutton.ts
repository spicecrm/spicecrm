/**
 * @module ObjectComponents
 */
import {Component, OnDestroy, OnInit} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {Subscription} from "rxjs";

@Component({
    selector: 'object-action-edit-button',
    templateUrl: './src/objectcomponents/templates/objectactioneditbutton.html'
})
export class ObjectActionEditButton implements OnInit, OnDestroy {

    public disabled: boolean = true;
    private subscriptions: Subscription = new Subscription();

    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
    ) {

    }

    public ngOnInit() {

        this.handleDisabled(this.model.isEditing ? 'edit' : 'display');

        // handleDisabled on on model.mode changes
        this.subscriptions.add(
            this.model.mode$.subscribe(mode => {
                this.handleDisabled(mode);
            })
        );

        // handleDisabled on on model.data changes
        this.subscriptions.add(
            this.model.data$.subscribe(data => {
                this.handleDisabled(this.model.isEditing ? 'edit' : 'display');
            })
        );
    }

    /*
    * @call model.edit
    */
    public execute() {
        this.model.edit();
    }

    /*
    * @unsubscribe subscriptions
    */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    /*
    * @return boolean
    */
    private handleDisabled(mode) {
        if (this.model.data.acl && !this.model.checkAccess('edit')) {

            this.disabled = true;
            return;
        }
        this.disabled = mode == 'edit';
    }
}
