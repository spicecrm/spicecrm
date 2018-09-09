import {Component, Input, HostBinding, OnInit} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {telecockpitservice} from '../services/telecockpit.service';

@Component({
    selector: 'tele_sales_cockpit_list_item',
    templateUrl: './app/modules/telesales/templates/telesalescockpitlistitem.html',
    providers: [model, view]
})
export class TeleSalesCockpitListItem implements OnInit{

    @Input() item : any = {};
    componentconfig: any = {};
    componentFields: any = {};

    constructor(private language: language,
                private model: model,
                private view: view,
                private metadata: metadata,
                private telecockpitservice: telecockpitservice) {
    }

    ngOnInit(){

        this.model.module = this.item.module;
        this.model.id = this.item.id;
        this.model.data = this.item.data;

        this.componentconfig = this.metadata.getComponentConfig('TeleSalesCockpitListItem', this.model.module);
        this.componentFields = this.metadata.getFieldSetFields(this.componentconfig.fieldset);
    }

    setselectedLogId(){
        this.telecockpitservice.logId = this.model.id;
    }

    get selectedLogId() {
        return this.telecockpitservice.selectedLogId;
    }

    getHitsStyle(){

        return {
            'border-radius': '50%',
            'padding': this.item.hits.length > 1 ? '5px 5px 5px 3px': '5px',
            'line-height': this.item.hits.length > 1 ? '80%': '60%',
            'display': 'inline-block',
            'border': 'none'
        }
    }


}