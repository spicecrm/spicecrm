import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {GroupwareService} from '../../../include/groupware/services/groupware.service';
import {model} from '../../../services/model.service';
import {Router} from "@angular/router";
import {view} from "../../../services/view.service";
import {language} from "../../../services/language.service";
import {metadata} from "../../../services/metadata.service";

@Component({
    selector: 'groupware-detail-pane-bean',
    templateUrl: './src/include/groupware/templates/groupwaredetailpanebean.html',
    providers: [view]
})
export class GroupwareDetailPaneBean implements OnInit {

    @Input() private bean: any;
    @Output() private selected: EventEmitter<any> = new EventEmitter<any>();

    private mainfieldsetfields: any[];
    private subfieldsetfields: any[];

    constructor(
        private groupware: GroupwareService,
        private language: language,
        private metadata: metadata,
        private model: model,
        private router: Router,
    ) {}

    public ngOnInit() {
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

    private onClick(event) {
        this.selected.emit({module: this.bean.module, id: this.bean.id});
        // this.router.navigate(['module/' + this.bean.module + '/' + this.bean.id]);
    }
}
