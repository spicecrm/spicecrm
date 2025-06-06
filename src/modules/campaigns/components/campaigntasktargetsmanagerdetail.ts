/**
 * @module ModuleCampaigns
 */
import {Component, Input} from '@angular/core';
import {model} from '../../../services/model.service';

/**
 * allows management of targets in multiple targetlists on a campaigntask
 */
@Component({
    selector: 'campaigntask-target-manager-details',
    templateUrl: '../templates/campaigntasktargetsmanagerdetails.html',
    standalone: false
})
export class CampaignTaskTargetsManagerDetails {
    /**
     * the model data
     */
    @Input() public fieldset: string;

    constructor(public model: model) {
    }
}
