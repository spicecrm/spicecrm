/**
 * @module ModuleProjects
 */
import {Component, OnInit, Optional, ViewContainerRef} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {navigationtab} from '../../../services/navigationtab.service';
import {Router} from "@angular/router";

/**
 * renders the button for the Audit log. This is uised in the standard actionsets
 */
@Component({
    selector: 'project-settlement-button',
    templateUrl: '../templates/projectsettlementbutton.html'
})
export class ProjectSettlementButton implements OnInit {

    /**
     * defautls to true and is set in ngOnInit checking if the module is audit enabled
     */
    public disabled: boolean = false;

    /**
     * defautls to true and is set in ngOnInit checking if the module is audit enabled
     */
    public hidden: boolean = false;

    constructor(
        public language: language,
        public metadata: metadata,
        public model: model,
        @Optional() public navigationtab: navigationtab,
        public router: Router
    ) {
    }

    /**
     * checks if the module is audit enabled and if enables the button
     */
    public ngOnInit() {

    }

    /**
     * the method to execute the button action
     */
    public execute() {
        let link = `module/Projects/${this.model.id}/settlement`;
        if (this.navigationtab?.tabid) {
            link = `/tab/${this.navigationtab.tabid}/${link}`;
        }

        this.router.navigate([link]);
    }
}
