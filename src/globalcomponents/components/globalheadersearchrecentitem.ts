/**
 * @module GlobalComponents
 */
import {
    AfterViewInit, ComponentFactoryResolver, Component, Input, NgModule, ViewChild, ViewContainerRef, EventEmitter,
    OnInit, Output
} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {Router} from '@angular/router';

@Component({
    selector: '[global-header-search-recent-item]',
    templateUrl: './src/globalcomponents/templates/globalheadersearchrecentitem.html',
    providers: [model, view],
    host: {
        "(click)": "navigateTo()"
    }
})
export class GlobalHeaderSearchRecentItem implements OnInit {
    @Input() private item: any = {};
    @Output() private selected: EventEmitter<any> = new EventEmitter<any>();

    private mainfieldsetfields: any[];
    private subfieldsetfields: any[];

    constructor(private model: model, private router: Router, private language: language, private metadata: metadata, private view: view) {
        this.view.displayLabels = false;
    }

    private navigateTo() {
        this.selected.emit(true);
        this.router.navigate(['/module/' + this.model.module + '/' + this.model.id]);
    }

    private gethref() {
        return '#/module/' + this.model.module + '/' + this.model.id;
    }

    public ngOnInit() {
        this.model.module = this.item.module_name;
        this.model.id = this.item.item_id;
        this.model.data = this.model.utils.backendModel2spice(this.model.module, this.item.data);
        // this.model.data.summary_text = this.item.item_summary;

        // get the fieldconfig
        let componentconfig = this.metadata.getComponentConfig('GlobalHeaderSearchResultsItem', this.model.module);
        if(componentconfig && componentconfig.mainfieldset) this.mainfieldsetfields = this.metadata.getFieldSetItems(componentconfig.mainfieldset);
        if(componentconfig && componentconfig.subfieldset) this.subfieldsetfields = this.metadata.getFieldSetItems(componentconfig.subfieldset);

    }
}
