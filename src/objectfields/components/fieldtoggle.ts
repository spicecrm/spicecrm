import {Component} from "@angular/core";
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

export class fieldToggle extends fieldGeneric {

    constructor(public model: model,
                public view: view,
                public language: language,
                public metadata: metadata,
                public router: Router,
                public modal: modal
                ) {
        super(model, view, language, metadata, router);
    }

    /**
     * disables the field
     */
    get disabled(): boolean {
        return !this.metadata.checkModuleAcl(this.model.module, 'edit') || this.restrictAccess();
    }

    /**
     * if strictAccess is set in field config
     * the toggle is disabled if the current_user is not the assigned_user of th bean
     */
    public restrictAccess(): boolean {
        if(this.fieldconfig.strictAccess){
            if(this.metadata.session.authData.user.id != this.model.data.assigned_user_id) return true;
        }
        return false
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