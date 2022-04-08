/**
 * @module ObjectComponents
 */
import {Component, EventEmitter, Output} from '@angular/core';
import {ObjectActionOutputBeanButton} from "./objectactionoutputbeanbutton";

@Component({
    selector: 'object-action-live-compile-bean-button',
    templateUrl: '../templates/objectactionlivecompilebeanbutton.html'
})
export class ObjectActionLiveCompileBeanButton extends ObjectActionOutputBeanButton {
    /**
     * emit the action to the container
     */
    @Output() public actionemitter: EventEmitter<any> = new EventEmitter<any>();

    /**
     * call the parent open output with live compile
     */
    public openOutput() {
        if (this.templates.length > 0) {
            // sort the templates
            this.templates.sort((a, b) => a.name > b.name ? 1 : -1);

            // open the modal
            this.modal.openModal('ObjectActionOutputBeanModal', true, this.viewContainerRef.injector).subscribe(outputModal => {
                outputModal.instance.templates = this.templates;
                outputModal.instance.modalTitle = this.modalTitle;
                outputModal.instance.noDownload = this.noDownload;
                outputModal.instance.handBack = this.handBack;
                outputModal.instance.liveCompile = true;
                outputModal.instance.forcedFormat = 'pdf';
                outputModal.instance.customActionsetId = this.actionconfig.modal_actionset;
                outputModal.instance.buttonText = this.buttonText;
                outputModal.instance.outputModalService.modalResponse$.subscribe(res => {
                    if (res != 'marksent') return;
                    this.actionemitter.emit(res);
                });
            });
        } else {
            this.modal.info('No Templates Found', 'there are no Output templates defined for the Module');
        }
    }
}
