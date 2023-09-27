import {Component, OnInit} from "@angular/core";
import {fieldGeneric} from "./fieldgeneric";
import {model} from "../../services/model.service";
import {Router} from "@angular/router";
import {view} from "../../services/view.service";
import {language} from "../../services/language.service";
import {metadata} from "../../services/metadata.service";
import {modal} from "../../services/modal.service";

@Component({
    selector: 'field-toggle',
    templateUrl: '../templates/fieldtoggle.html'
})

/**
 * renders checkbox toggle in a field
 */

export class fieldToggle extends fieldGeneric implements OnInit{

    /**
     * the hidden property hiding the toggle field if the user does not have the proper access rights
     */
    public hidden: boolean = false;

    /**
     * holds the current user id
     * @private
     */
    private currentUser: string = '';

    /**
     * holds the assigned_user_id
     * @private
     */
    private assignedUser: string = '';

    /**
     * holds the created by user id
     * @private
     */
    private createdBy: string = '';

    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router,
        public modal: modal,
        ) {
        super(model, view, language, metadata, router);
    }

    public ngOnInit(): void {
        // if acl action is required and user has no access, hide the field
        if (this.fieldconfig.acl && !this.metadata.checkModuleAcl(this.model.module, this.fieldconfig.acl)) {
            this.hidden = true;
        }

        this.currentUser = this.metadata.session.authData.user.id;
        this.currentUser = this.model.data.assigned_user_id;

        // check if are in edit mode
        if(this.model.isNew) {
            this.createdBy = this.model.data.created_by_id;
        } else {
            this.createdBy = this.model.data.created_by;
        }
    }

    /**
     * disables the field
     * @return boolean
     * */
    get disabled(): boolean {
        return !this.metadata.checkModuleAcl(this.model.module, 'edit') || !this.userCanEdit();
    }

    /**
     * manages visibility of the toggle
     * default: visible if the current_user is the created_by user of the bean
     * visibility for assigned_user can be set up in the field config
     * @return boolean
     */
    private userCanEdit(): boolean {
        if(this.fieldconfig.assignedUserAccess) {
            return this.currentUser === this.assignedUser;
        } else {
            return this.currentUser === this.createdBy;
        }
    }

    /**
     * sets the new field value
     * @param value
     */
    public setValue(value: boolean): void {
        this.model.setField(this.fieldname, value);

        // allow to save automatically only if configured
        if(this.fieldconfig.autoSave) this.save();
    }

    /**
     * saves the new field value
     */
    public save() {
        let updateEmitter = this.modal.await('LBL_UPDATING');

        this.model.save(true).subscribe({
            next: (data) => {
                updateEmitter.emit(true);
            }, error: () => {
                updateEmitter.emit(true);
            }, complete: () => {
                updateEmitter.emit(true);
            }
        });
    }

}