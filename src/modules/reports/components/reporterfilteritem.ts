import {
    Component,
    Input,
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
    selector: 'reporter-filter-item',
    templateUrl: './app/modules/reports/templates/reporterfilteritem.html'
})
export class ReporterFilterItem {

    @Input() wherecondition : any = {};

    constructor(private language: language, private model: model, private reporterconfig: reporterconfig) {

    }

    getOperators(){
        return this.reporterconfig.operatorTypes[this.reporterconfig.operatorAssignments[this.wherecondition.type]];
    }

    get itemType(){
        let type = 'text';

        switch(this.wherecondition.type){
            case 'enum':
                switch(this.wherecondition.operator){
                    case 'equals':
                    case 'notequal':
                    case 'oneof':
                    case 'oneofnot':
                    case 'oneofnotornull':
                        type = 'enum';
                        break;
                }
                break;
        }

        return type;

    }

    get showValue(){
        return this.reporterconfig.operatorCount[this.wherecondition.operator] > 0;
    }

    get showValueTo(){
        return this.reporterconfig.operatorCount[this.wherecondition.operator] > 1;
    }

    changeOperator(){
        this.wherecondition.value = '';
        this.wherecondition.valuekey = '';
        this.wherecondition.valueto = '';
        this.wherecondition.valuetokey = '';
    }

}