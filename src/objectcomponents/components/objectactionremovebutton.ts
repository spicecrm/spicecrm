/**
 * @module ObjectComponents
 */
import {AfterViewInit, Component, EventEmitter, OnDestroy, Output} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {view} from "../../services/view.service";
import {modal} from "../../services/modal.service";
import {relatedmodels} from "../../services/relatedmodels.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'object-action-remove-button',
    templateUrl: '../templates/objectactionremovebutton.html'
})
export class ObjectActionRemoveButton implements AfterViewInit, OnDestroy {

    /**
     * the ationemitter the container can subscribe to
     */
    @Output() public actionemitter: EventEmitter<any> = new EventEmitter<any>();

    /**
     * defines if the delete ooptionis disabled. By defualt it is but this is checked on model load and model changes and set accordingly to ACL Rules there
     */
    public disabled: boolean = true;

    /**
     * if set to true didpslay teh button as icon
     */
    public displayasicon: boolean = false;

    /**
     * the subscriptions the component has
     */
    public subscriptions: Subscription = new Subscription();

    constructor(public language: language, public metadata: metadata, public model: model, public view: view, public relatedmodels: relatedmodels, public modalservice: modal) {

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
    * @return boolean
    */
    get canDelete() {
        try {
            let access = this.model.checkAccess('deleterelated');
            if (!access) {
                access = this.model.checkAccess('delete');
            }
            return access;
        } catch (e) {
            return false;
        }
    }

    /*
    * @handleDisabled
    */
    public ngAfterViewInit() {
        this.handleDisabled(this.model.isEditing ? 'edit' : 'display');
    }

    /*
    * @confirm delete
    * @relatedmodels.deleteItem if answer is true
    */
    public execute() {
        this.modalservice.confirm(this.language.getLabel('QST_REMOVE_ENTRY'), this.language.getLabel('QST_REMOVE_ENTRY', null, 'short'))
            .subscribe((answer) => {
                if (answer) this.relatedmodels.deleteItem(this.model.id);
            });
    }

    /*
    * @set disabled
    * @delete if answer is true
    */
    public handleDisabled(mode) {
        if (!this.canDelete) {
            this.disabled = true;
            return;
        }
        this.disabled = mode == 'edit';
    }

    /*
    * @unsubscribe subscriptions
    */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
}
