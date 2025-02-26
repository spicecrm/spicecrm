/**
 * @module ModuleGroupware
 */
import {Component, Input, OnInit, Output, EventEmitter, NgZone} from '@angular/core';
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
        public view: view,
        private zone: NgZone
    ) {
        this.view.displayLabels = false;
    }

    public ngOnInit() {

        this.zone.run(() => {
            this.model.module = this.bean.module;
            this.model.id = this.bean.id;
            this.model.setData(this.bean.data);

            let config = this.metadata.getComponentConfig('GroupwareDetailPaneBean', this.model.module);

            if (window._.isEmpty(config)) {
                config = this.metadata.getComponentConfig('GlobalHeaderSearchResultsItem', this.model.module);
            }

            if (config && config.mainfieldset) {
                this.mainfieldsetfields = this.metadata.getFieldSetItems(config.mainfieldset);
            }
            if (config && config.subfieldset) {
                this.subfieldsetfields = this.metadata.getFieldSetItems(config.subfieldset);
            }
        });
    }

    public onClick(event) {
        this.selected.emit({module: this.bean.module, id: this.bean.id});
    }
}
