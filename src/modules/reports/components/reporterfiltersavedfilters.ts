import {
    Component,
    Input,
    Output,
    EventEmitter,
    AfterViewInit,
    OnInit,
    ViewChild,
    ViewContainerRef,
    OnDestroy
} from '@angular/core';
import {ActivatedRoute}   from '@angular/router';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {navigation} from '../../../services/navigation.service';
import {backend} from '../../../services/backend.service';

import  {reporterconfig} from '../services/reporterconfig';

@Component({
    selector: 'reporter-filter-saved-filters',
    templateUrl: './app/modules/reports/templates/reporterfiltersavedfilters.html'
})
export class ReporterFilterSavedFilters implements OnInit {

    @Output() filtersaved: EventEmitter<any> = new EventEmitter<any>();
    @Input() reportid: string = '';

    savedFilters: Array<any> = [];
    currentSelectedFilter: string = '';

    constructor(private metadata: metadata, private model: model, private language: language, private reporterconfig: reporterconfig, private backend: backend) {

    }

    ngOnInit() {
        this.backend.getRequest('KReporter/' + this.reportid + '/savedfilter/assigneduserid/own').subscribe(filters => {
            this.savedFilters = filters;
        });
    }

    get selectedFilter(){
        return this.currentSelectedFilter;
    }

    set selectedFilter(filterId){
        this.currentSelectedFilter = filterId;
        if(this.currentSelectedFilter == ''){
            this.reporterconfig.setDefaultUserFilter();
        } else {
            this.savedFilters.some(filter => {
                if (filter.savedfilter_id == filterId) {
                    this.reporterconfig.setSavedFilter(JSON.parse(filter.selectedfilters));
                    return true;
                }
            })
        }
    }

    get isDisabled(){
        return this.savedFilters.length == 0;
    }

}