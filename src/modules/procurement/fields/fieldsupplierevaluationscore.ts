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
import {fieldGeneric} from "../../../objectfields/components/fieldgeneric";
import {fieldSlider} from "../../../objectfields/components/fieldslider";

@Component({
    selector: 'field-supplier-evaluation-score',
    templateUrl: '../templates/fieldsupplierevaluationscore.html'
})
export class fieldSupplierEvaluationScore extends fieldSlider {

    private items = ['service', 'cost', 'operations', 'performance', 'ethics'];

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, public broadcast: broadcast) {
        super(model, view, language, metadata, router);

        this.subscriptions.add(
            this.model.data$.subscribe({
                next: (data) => {
                    this.calculateScore();
                }
            })
        )
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


    private calculateScore(){
        if(this.view.isEditMode()){
            let totalWeights = 0;
            let totalScore = 0;
            this.items.forEach(item => {
                totalWeights += parseFloat(this.model.getField('score_weight_'+item));
                if(!isNaN(parseFloat(this.model.getField('score_'+item)))) {
                    totalScore += parseFloat(this.model.getField('score_' + item)) * parseFloat(this.model.getField('score_weight_' + item));
                }
            })
            this.value = totalScore / totalWeights;
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
