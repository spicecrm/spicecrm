/**
 * create eventregistration records for selected prospect list records
 * step by step layout
 * 1. select prospect lists
 * 2. set common values for the created event registrations
 * @module ModuleEvents
 */
import {Component, ComponentRef, SkipSelf} from '@angular/core';
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {backend} from "../../../services/backend.service";
import {modelutilities} from "../../../services/modelutilities.service";
import {relatedmodels} from "../../../services/relatedmodels.service";
import {toast} from "../../../services/toast.service";
import {language} from "../../../services/language.service";

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
     * the available convert steps
     *
     * currently hardcoded ... might make sense to create a generic convert method that allows multi step conversion
     */
    public totalSteps: string[] = ['ProspectLists', 'EventRegistrations'];

    constructor(public model: model, public metadata: metadata, public backend: backend, @SkipSelf() public eventModel: model, public modelutilities: modelutilities, public relatedmodels: relatedmodels, public toast: toast, public language: language) {
        this.model.module = 'EventRegistrations';
        this.model.initialize();
        this.model.startEdit();
    }

    /**
     *determines the width in % for the style of the progress bar
     */
    public getProgressBarWidth() {
        return {
            width: (this.currentStep / (this.totalSteps.length - 1) * 100) + '%'
        };
    }


    /**
     * returns the class for the step in the guide
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

    /**
     * handle selected item IDs
     * Add it when not present in the array, remove it when present
     * toggle behaviour
     * @param targetlist
     */
    public fetchListData(targetlist){
        let idx = this.holdListData.indexOf(targetlist[0].id);
        // add
        if(idx < 0){
            this.holdListData.push(targetlist[0].id);
        } else{ // remove
            delete this.holdListData[idx];
            // remove empty values
            this.holdListData = this.holdListData.filter(function (el) {
                return el != null;
            });
        }
    };

    /**
     * returns true if the step is completed for the display
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
     * determines if the save button is shown
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

    /**
     * used to diable the buttons
     * if no items were selected we disable
     */
    public disableNext() {
        if(this.holdListData.length) return false;
        return true;
    }

    /**
     * save registrations
     */
    public save() {
        let postData: any = {
            targetListIds: this.holdListData,
            registrationData: this.modelutilities.spiceModel2backend(this.model.module, this.model.data),
            eventId: this.eventModel.id,
        }

        this.backend.postRequest(`module/Events/${this.eventModel.id}/registrations`, {}, postData).subscribe((results: any) => {
            // reload subpanel
            this.relatedmodels.relatedModule = 'EventRegistrations';
            this.relatedmodels.getData();

            // send Toat
            let msg = this.language.getLabel('LBL_CREATED_EVENTREGISTRATIONS');
            this.toast.sendToast(msg + ': '+ results.added_prospects_count, 'success');

            // close window
            this.closeModal();
        });
    }

    // Close the modal.
    public closeModal() {
        this.self.destroy();
    }

    // Escape pressed or [x] clicked.
    public onModalEscX() {
        this.closeModal();
    }
}
