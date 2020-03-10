/**
 * @module ModuleEmails
 */
import {Component, Injector} from '@angular/core';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {view} from "../../../services/view.service";
import {backend} from "../../../services/backend.service";
import {metadata} from "../../../services/metadata.service";
import {toast} from "../../../services/toast.service";

@Component({
    selector: "email-schedules-related-modal",
    templateUrl: "./src/modules/emails/templates/emailschedulesrelatedmodal.html",
    providers: [model, view],
})
export class EmailSchedulesRelatedModal {
    private self: any = {};
    private activetab: string = 'recipients';
    private prospects: any = [];
    private selectedModules: any = [];

    private isLoaded = false;

    constructor(private language: language,
                private model: model,
                private injector: Injector,
                private view: view,
                private modal: modal,
                private metadata: metadata,
                private backend: backend,
                private toast: toast) {

        this.view.isEditable = true;
        this.view.setEditMode();

    }

    public ngOnInit() {
        this.model.module = "EmailSchedules";
    }


    private select(currentmodule, isSelected) {
        if(isSelected) {
            this.selectedModules.push(currentmodule);
        } else {
            let pos = this.selectedModules.indexOf(currentmodule);
            this.selectedModules.splice(pos, 1);
        }
        window.console.log(this.selectedModules);
    }

    /**
     * check if each module in prospect_lists_prospects Object doesn't have emails link
     * @param modules
     */
    private fiilterProspects(modules) {
        for (let module in modules) {
            if (!this.metadata.getFieldDefs(module, 'emails')) {
                return module;
            }
        }
    }

    /**
     * destroy modal instance
     */
    private close() {
        this.self.destroy();
    }

}


