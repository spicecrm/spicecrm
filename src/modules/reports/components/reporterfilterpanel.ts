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
import {broadcast} from '../../../services/broadcast.service';


import  {reporterconfig} from '../services/reporterconfig';

@Component({
    selector: 'reporter-filter-panel',
    templateUrl: './app/modules/reports/templates/reporterfilterpanel.html'
})
export class ReporterFilterPanel {

    @Output() filtersaved: EventEmitter<any> = new EventEmitter<any>();
    @Input() integrationparams: any = {};

    constructor(private metadata: metadata, private model: model, private language: language, private reporterconfig: reporterconfig) {
/*
        let whereConditions = JSON.parse(model.data.whereconditions);
        for(let whereCondition of whereConditions){
            if(whereCondition.usereditable == 'yes')
                this.whereConditions.push(whereCondition);
        }
*/
    }

    get whereConditions(){
        return this.reporterconfig.userFilters;
    }

    saveFilter(){
        this.filtersaved.emit(true);
        this.reporterconfig.refresh();
    }


    get displaySavedFilters(){

        if (this.integrationparams.activePlugins) {
            for (let plugin in this.integrationparams.activePlugins) {
                switch (plugin) {
                    case 'ksavedfilters':
                        return true;
                }
            }
        }

        return false;
    }

}