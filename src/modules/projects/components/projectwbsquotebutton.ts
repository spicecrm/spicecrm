/**
 * @module ModuleProjects
 */
import {Component, OnInit, Optional, SkipSelf, ViewContainerRef} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {navigationtab} from '../../../services/navigationtab.service';
import {backend} from '../../../services/backend.service';
import {Router} from "@angular/router";

/**
 * renders the button for the Audit log. This is uised in the standard actionsets
 */
@Component({
    selector: 'projectwbs-quote-button',
    templateUrl: './src/modules/projects/templates/projectwbsquotebutton.html',
    providers: [model]
})
export class ProjectWBSQuoteButton {

    /**
     * defautls to true and is set in ngOnInit checking if the module is audit enabled
     */
    public disabled: boolean = false;

    /**
     * defautls to true and is set in ngOnInit checking if the module is audit enabled
     */
    public hidden: boolean = false;

    constructor(
        private language: language,
        private metadata: metadata,
        @SkipSelf() private parent: model,
        private model: model,
        private backend: backend,
        @Optional() private navigationtab: navigationtab,
        private router: Router
    ) {
        // only enable if the user can create Sales Documents
        this.disabled = !this.metadata.checkModuleAcl('SalesDocs', 'create');
    }

    /**
     * the method to execute the button action
     */
    public execute() {
        this.backend.postRequest(`module/ProjectWBSs/${this.parent.id}/quote`).subscribe(
            res => {
                this.model.module = 'SalesDocs';
                this.model.id = res.data.id;
                this.model.startEdit();
                this.model.data = this.model.utils.backendModel2spice('SalesDocs', res.data);
                this.model.edit();
            }
        )
    }
}
