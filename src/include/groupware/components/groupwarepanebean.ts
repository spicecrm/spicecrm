/**
 * @module ModuleGroupware
 */
import {Component, Input, OnInit} from '@angular/core';
import {GroupwareService} from '../../../include/groupware/services/groupware.service';
import {model} from '../../../services/model.service';
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";
import {view} from "../../../services/view.service";

/**
 * A bean component. Dsiplays a list of Beans that are matched to an email address
 */
@Component({
    selector: 'groupware-pane-bean',
    templateUrl: './src/include/groupware/templates/groupwarepanebean.html',
    providers: [view]
})
export class GroupwarePaneBean implements OnInit {

    /**
     * Current bean.
     */
    @Input() private bean: any;

    private mainfieldsetfields: any[];
    private subfieldsetfields: any[];

    constructor(
        private groupware: GroupwareService,
        private language: language,
        private metadata: metadata,
        private model: model,
        private view: view
    ) {
        this.view.displayLabels = false;
    }

    public ngOnInit() {
        // get the fieldconfig
        let componentconfig = this.metadata.getComponentConfig(
            'GlobalHeaderSearchResultsItem',
            this.model.module
        );
        if (componentconfig && componentconfig.mainfieldset) {
            this.mainfieldsetfields = this.metadata.getFieldSetItems(componentconfig.mainfieldset);
        }
        if (componentconfig && componentconfig.subfieldset) {
            this.subfieldsetfields = this.metadata.getFieldSetItems(componentconfig.subfieldset);
        }
    }

    /**
     * Toggles checkbox selection.
     *
     * @param event
     */
    private onClick(event) {
        if (event.target.checked) {
            this.groupware.addBean(this.bean);
        } else {
            this.groupware.removeBean(this.bean);
        }
    }
}
