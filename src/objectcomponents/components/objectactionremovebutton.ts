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
    templateUrl: './src/objectcomponents/templates/objectactionremovebutton.html'
})
export class ObjectActionRemoveButton implements AfterViewInit, OnDestroy {

    @Output() public actionemitter: EventEmitter<any> = new EventEmitter<any>();

    public module: string = '';
    /**
     * defines if the delete ooptionis disabled. By defualt it is but this is checked on model load and model changes and set accordingly to ACL Rules there
     */
    public disabled: boolean = true;
    private subscriptions: Subscription = new Subscription();

    constructor(private language: language, private metadata: metadata, private model: model, private view: view, private relatedmodels: relatedmodels, private modalservice: modal) {

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
    private handleDisabled(mode) {
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
