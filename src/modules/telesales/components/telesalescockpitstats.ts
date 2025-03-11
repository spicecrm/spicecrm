/**
 * @module ModuleTeleSales
 */
import {Component, Input, QueryList, ViewChild, ViewChildren, ViewContainerRef} from '@angular/core';
import {language} from '../../../services/language.service';
import {telecockpitservice} from '../services/telecockpit.service';
import {modellist} from '../../../services/modellist.service';
import {model} from '../../../services/model.service';
import {view} from "../../../services/view.service";
import {TeleSalesCockpitListItem} from "./telesalescockpitlistitem";

@Component({
    selector: 'tele-sales-cockpit-stats',
    templateUrl: '../templates/telesalescockpitstats.html',
})
export class TeleSalesCockpitStats {

    public statSequence = [
        'completed', 'attempted', 'maxattempts', 'targeted', 'initial'
    ]

    public statColorClass = {
        completed: 'slds-theme--success',
        attempted: 'slds-theme--warning',
        maxattempts: 'slds-theme--error',
        targeted: 'slds-theme--shade',
        initial: 'slds-theme--shade'
    }

    constructor(
        public telecockpitservice: telecockpitservice) {
    }

    public getstatStyle(status){
        let totalCount = 0;
        let leftCount = 0;
        let thisCount = 0;
        //this.telecockpitservice.campaignTaskStats.forEach(s => {
        if(this.telecockpitservice && this.telecockpitservice.campaignTaskStats && this.telecockpitservice.campaignTaskStats.length > 0) {
            for (let s of this.telecockpitservice.campaignTaskStats) {
                totalCount += parseInt(s.count, 10);
                if (this.statSequence.indexOf(s.activity_type) < this.statSequence.indexOf(status)) {
                    leftCount += parseInt(s.count, 10);
                }

                if (s.activity_type == status) {
                    thisCount = parseInt(s.count, 10);
                }
            }
        }
        return {
            width: thisCount ? Math.round((thisCount / totalCount) * 100) + '%' : '0px',
            left: leftCount ? Math.round((leftCount / totalCount) * 100) + '%'  : '0px'
        }
    }

    get getTitle(){
        let title = '';
        if(this.telecockpitservice && this.telecockpitservice.campaignTaskStats && this.telecockpitservice.campaignTaskStats.length > 0){
            for(let s of this.statSequence){
                let statrecord = this.telecockpitservice.campaignTaskStats.find(sr => sr.activity_type == s);
                title += s + ': ' + (statrecord ? statrecord.count : 0) + '\n';
            }
        }
        return title;
    }

    public refresh(){
        this.telecockpitservice.loadStats();
    }

}
