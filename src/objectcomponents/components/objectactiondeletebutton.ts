/**
 * @module ObjectComponents
 */
import {AfterViewInit, Component, Injector, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {helper} from '../../services/helper.service';
import {language} from '../../services/language.service';
import {Subscription} from "rxjs";

/**
 * standard actionset item to delete a model
 */
@Component({
    selector: 'object-action-delete-button',
    templateUrl: './src/objectcomponents/templates/objectactiondeletebutton.html',
    providers: [helper]
})
export class ObjectActionDeleteButton implements AfterViewInit, OnDestroy {

    /**
     * defines if the delete ooptionis disabled. By defualt it is but this is checked on model load and model changes and set accordingly to ACL Rules there
     */
    public disabled: boolean = true;

    /**
     * holds the subscriptions
     */
    private subscriptions: Subscription = new Subscription();

    /**
     * holds the action config
     */
    public actionconfig: any = {};

    constructor(private language: language, private metadata: metadata, private model: model, private router: Router, private helper: helper, private injector: Injector) {

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
            return this.model.checkAccess('delete');
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
    * @unsubscribe subscriptions
    */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    /*
    * @confirm delete
    * @delete if answer is true
    */
    public execute() {
        this.helper.confirm(this.language.getLabel('MSG_DELETE_RECORD'), this.language.getLabel('MSG_DELETE_RECORD', 'long'))
            .subscribe(answer => {
                if (answer) {
                    this.delete();
                }
            });
    }

    /*
    * @model.delete
    * @navigate to list view
    */
    private delete() {
        window.console.log(this.injector);
        this.model.delete().subscribe(status => {
            this.completeAction();
        });
    }

    /**
     * completes and redirects to the list except other set in the config
     */
    private completeAction(){
        if(this.actionconfig.noredirectoncomplete == true) return;

        // reditrect to the list
        this.router.navigate(['/module/' + this.model.module]);
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
}
