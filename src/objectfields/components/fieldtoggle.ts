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

    constructor(public model: model,
                public view: view,
                public language: language,
                public metadata: metadata,
                public router: Router,
                public modal: modal
                ) {
        super(model, view, language, metadata, router);
    }

    public ngOnInit(): void {
        // if acl action is required and user has no access, hide the field
        if (this.fieldconfig.acl && !this.metadata.checkModuleAcl(this.model.module, this.fieldconfig.acl)) {
            this.hidden = true;
        }
    }

    /**
     * disables the field
     * @return boolean
     * */
    get disabled(): boolean {
        return !this.metadata.checkModuleAcl(this.model.module, 'edit') || !this.hasAccess();
    }

    /**
     * the toggle is enabled if the current_user is the created_by user of the bean
     * @return boolean
     */
    public hasAccess(): boolean {
        return this.metadata.session.authData.user.id === this.model.data.created_by;
    }

    /**
     * saves the new field value
     * @param value
     */
    public setValue(value: boolean): void {
        let updateEmitter = this.modal.await('LBL_UPDATING');
        this.model.setField(this.fieldname, value);
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