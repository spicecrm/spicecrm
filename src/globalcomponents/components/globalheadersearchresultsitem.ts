/**
 * @module GlobalComponents
 */
import {
    Component, Input, EventEmitter,
    OnInit, Output
} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {view} from '../../services/view.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {Router} from '@angular/router';

@Component({
    selector: '[global-header-search-results-item]',
    templateUrl: './src/globalcomponents/templates/globalheadersearchresultsitem.html',
    providers: [model, view],
    host: {
        "(click)": "navigateTo()"
    }
})
export class GlobalHeaderSearchResultsItem implements OnInit {
    @Input() private hit: any = {};
    @Output() private selected: EventEmitter<any> = new EventEmitter<any>();

    private mainfieldset: string;
    private subfieldsetfields: any[];

    constructor(private model: model, private view: view, private router: Router, private language: language, private metadata: metadata) {
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
        this.model.module = this.hit._type;
        this.model.id = this.hit._id;

        // get the fieldconfig
        let componentconfig = this.metadata.getComponentConfig('GlobalHeaderSearchResultsItem', this.model.module);
        this.mainfieldset = componentconfig.mainfieldset;
        if(componentconfig && componentconfig.subfieldset) this.subfieldsetfields = this.metadata.getFieldSetItems(componentconfig.subfieldset);

        this.model.data = this.model.utils.backendModel2spice(this.model.module, this.hit._source);
    }
}
