/**
 * @module ModuleCampaigns
 */
import {Component, ComponentRef} from '@angular/core';
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {backend} from "../../../services/backend.service";
import {any, forEach} from "underscore";

@Component({
    selector: 'event-registration-modal',
    templateUrl: '../templates/eventregistrationmodal.html',
    providers: [model]
})
export class EventRegistrationModal {

    public self: ComponentRef<EventRegistrationModal>;

    public componentconfig: any;

    /**
     * the current  step
     */
    public currentStep: number = 0;

    /**
     * the availabel convert steps
     *
     * currently hardcoded .. might make sense to create a generic conmvert method that allows multi step conversion
     */
    public totalSteps: string[] = ['ProspectLists', 'EventRegistrations'];

    constructor(public model: model, public metadata: metadata, public backend: backend) {

        // let componentConfig = this.metadata.getComponentConfig('ObjectModalModuleLookup', this.model.module);
        // this.componentconfig = componentConfig.componentconfig;
        this.model.module = 'EventRegistrations';
        this.model.initialize();
        // this.model.initializeFieldsStati();
        // this.model.registerModel();
        this.model.startEdit();
    }

    /**
     * returns the class for the step int he guide
     *
     * @param convertStep
     */
    public getStepClass(convertStep: any) {
        let thisIndex = this.totalSteps.indexOf(convertStep);
        if (thisIndex == this.currentStep) {
            return 'slds-is-active';
        }
        if (thisIndex < this.currentStep) {
            return 'slds-is-completed';
        }
    }

    public holdListData: any [] = [];

    public fetchListData(event){
        this.holdListData.push(event)
    };

    /**
     * rerutns true if the step is completed for the display
     * @param Step
     */
    public getStepComplete(Step: any) {
        let thisIndex = this.totalSteps.indexOf(Step);
        if (thisIndex < this.currentStep) {
            return true;
        }
        return false;
    }

    /**
     * moves one step backwards
     */
    public prevStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
        }
    }

    /**
     * determines if the next button is shown
     */
    public showNext() {
        return this.currentStep < this.totalSteps.length - 1;
    }

    /**
     * detemrines if the save button is shown
     */
    public showSave() {
        return this.currentStep == this.totalSteps.length - 1;
    }

    /**
     * gets the next step
     */
    public nextStep() {
        this.currentStep++;
    }

    public save() {
        let postData: any = {
            listData: this.holdListData,
            registrationData: this.model.data,
        }
        this.backend.postRequest(`module/Events/${this.model.id}/registrations`, {}, postData).subscribe((results: any) => {
            this.self.destroy();
        });
    }

    public close() {
        this.self.destroy();
    }
}
