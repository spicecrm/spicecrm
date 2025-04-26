/**
 * @module ModuleProcessManagement
 */
import {Component} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {EnumDisplayOptionArray, language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {broadcast} from '../../../services/broadcast.service';
import {Router} from '@angular/router';
import {fieldEnum} from "../../../objectfields/components/fieldenum";

@Component({
    selector: 'field-process-impact-score',
    templateUrl: '../templates/fieldprocessimpactscore.html'
})
export class fieldProcessImpactScore extends fieldEnum {

    public options: EnumDisplayOptionArray = [];

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, public broadcast: broadcast) {
        super(model, view, language, metadata, router);

        this.subscriptions.add(
            this.model.data$.subscribe({
                next: (data) => {
                    this.calculateRisk();
                }
            })
        )

        if(this.model.module == 'ProcessRisks') {
            this.subscriptions.add(
                this.broadcast.message$.subscribe({
                    next: (message) => {
                        this.handleMessage(message);
                    }
                })
            )
        }
    }

    /**
     * a getter for the value bound top the model
     */
    get value() {
        return this.model.getField(this.fieldname);
    }

    /**
     * a setter that returns the value to the model and triggers the validation
     *
     * @param val the new value
     */
    set value(val) {
        this.model.setField(this.fieldname, val ?? '', true);
    }


    private calculateRisk(){
        if(this.view.isEditMode() && this.model.getField('risk_impact') >= 0 && this.model.getField('risk_probability') >= 0 && this.model.getField('risk_frequency') >= 0){
            let risk = this.model.getField('risk_impact') + this.model.getField('risk_probability') + this.model.getField('risk_frequency');
            if(risk >= 20){
                this.value = 'H';
            } else if(risk >= 10){
                this.value = 'M';
            } else {
                this.value = 'L'
            }
        } else {
            this.value = 'L'
        }
    }

    get badgeClass(){
        switch (this.value){
            case 'H':
                return 'slds-theme--error';
            case 'M':
                return 'slds-theme--warning';
            case 'L':
                return 'slds-theme--success';
            default:
                return '';
        }
    }

    /**
     * set the score direct if a reisk is saved
     * @param message
     * @private
     */
    private handleMessage(message){
        console.log(message);
        if(message.messagetype == 'model.save' && message.messagedata.module == 'ProcessRiskAssessments' &&  message.messagedata.data.status == 'A' &&  message.messagedata.data.processrisk_id == this.model.id && !!message.messagedata.data.score){
            this.value = message.messagedata.data.score;
        }
    }

}
