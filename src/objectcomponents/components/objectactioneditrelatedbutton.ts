/**
 * @module ObjectComponents
 */
import {Component, Directive, OnDestroy, OnInit, ViewChild, SkipSelf} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {Subscription} from "rxjs";

@Component({
    selector: 'object-action-edit-related-button',
    templateUrl: '../templates/objectactioneditrelatedbutton.html',
    providers: [model]
})
export class ObjectActionEditRelatedButton implements OnInit, OnDestroy {

    public disabled: boolean = true;

    /**
     * the action config from the actionset
     */
    public actionconfig: any = {};

    /**
     * this is a helper so we have a subcomponent that can provide a new model
     *
     * this model is detected via teh component and then addressed
     */
    public subscriptions: Subscription = new Subscription();

    constructor(
        public language: language,
        public metadata: metadata,
        @SkipSelf() public parent: model,
        public model: model
    ) {

    }

    public ngOnInit() {
        this.handleDisabled(this.parent.isEditing ? 'edit' : 'display');

        // handleDisabled on on model.mode changes
        this.subscriptions.add(
            this.parent.mode$.subscribe(mode => {
                this.handleDisabled(mode);
            })
        );

        // handleDisabled on on model.data changes
        this.subscriptions.add(
            this.parent.data$.subscribe(data => {
                // Set the module of the new model and open a modal with copy rules
                this.model.module = this.actionconfig.module;
                this.model.id = this.parent.getFieldValue(this.actionconfig.parent_field);
                // this.model.getData(false);

                this.handleDisabled(this.parent.isEditing ? 'edit' : 'display');
            })
        );
    }

    get hidden() {
        return this.model.id ? false : true;
    }

    public execute() {
        this.model.edit(true);
    }

    /*
    * @unsubscribe subscriptions
    */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    /*
    * @set disabled
    */
    public handleDisabled(mode) {
        if (!this.parent.checkAccess('edit')) {
            this.disabled = true;
            return;
        }
        this.disabled = mode == 'edit';
    }
}
