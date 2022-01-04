/**
 * @module ModuleGroupware
 */
import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {GroupwareService} from '../../../include/groupware/services/groupware.service';
import {model} from '../../../services/model.service';
import {Router} from "@angular/router";
import {view} from "../../../services/view.service";
import {language} from "../../../services/language.service";
import {metadata} from "../../../services/metadata.service";

/**
 * The detailed view of a bean.
 */
@Component({
    selector: 'groupware-detail-pane-bean',
    templateUrl: '../templates/groupwaredetailpanebean.html',
    providers: [view, model]
})
export class GroupwareDetailPaneBean implements OnInit {

    /**
     * Current bean.
     */
    @Input() public bean: any;
    @Output() public selected: EventEmitter<any> = new EventEmitter<any>();

    public mainfieldsetfields: any[];
    public subfieldsetfields: any[];

    constructor(
        public groupware: GroupwareService,
        public language: language,
        public metadata: metadata,
        public model: model,
        public router: Router,
        public view: view
    ) {
        this.view.displayLabels = false;
    }

    public ngOnInit() {

        this.model.module = this.bean.module;
        this.model.id = this.bean.id;
        this.model.setData(this.bean.data);

        // get the fieldconfig
        let componentconfig = this.metadata.getComponentConfig(
            'GlobalHeaderSearchResultsItem', // todo create its own config if needed
            this.model.module
        );
        if (componentconfig && componentconfig.mainfieldset) {
            this.mainfieldsetfields = this.metadata.getFieldSetItems(componentconfig.mainfieldset);
        }
        if (componentconfig && componentconfig.subfieldset) {
            this.subfieldsetfields = this.metadata.getFieldSetItems(componentconfig.subfieldset);
        }
    }

    public onClick(event) {
        this.selected.emit({module: this.bean.module, id: this.bean.id});
        // this.router.navigate(['module/' + this.bean.module + '/' + this.bean.id]);
    }
}
