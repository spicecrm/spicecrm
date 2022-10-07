/**
 * @module ModuleCampaigns
 */
import {Component} from '@angular/core';
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";

@Component({
    selector: 'event-registration-modal',
    templateUrl: '../templates/eventregistrationmodal.html'
})
export class EventRegistrationModal {

    public self: any;

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

    constructor(public model: model, public metadata: metadata) {

        // let componentConfig = this.metadata.getComponentConfig('ObjectModalModuleLookup', this.model.module);
        // this.componentconfig = componentConfig.componentconfig;

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

    public save() {
        if (this.model.validate()) {
            this.model.save().subscribe(() => {
                this.self.destroy();
            });
        }
    }

    public close() {
        this.self.destroy();
    }
}
