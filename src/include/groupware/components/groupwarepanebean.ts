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
    templateUrl: '../templates/groupwarepanebean.html',
    providers: [view]
})
export class GroupwarePaneBean implements OnInit {

    /**
     * Current bean.
     */
    @Input() public bean: any;

    public mainfieldsetfields: any[];
    public subfieldsetfields: any[];

    constructor(
        public groupware: GroupwareService,
        public language: language,
        public metadata: metadata,
        public model: model,
        public view: view
    ) {
        // set base settings for the view
        this.view.displayLabels = false;
        // no links to be displayed here
        this.view.displayLinks = false;
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
    public onClick(event) {
        if (event.target.checked) {
            this.groupware.addBean(this.bean);
        } else {
            this.groupware.removeBean(this.bean);
        }
    }
}
