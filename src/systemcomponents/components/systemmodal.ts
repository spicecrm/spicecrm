/**
 * @module SystemComponents
 */
import {Component, Input} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {metadata} from '../../services/metadata.service';
import {layout} from '../../services/layout.service';

/**
 * a component that is the base for a modal window. It can conatain a set of other components
 * - system-modal-header
 * - system-modal-content
 * - system-modal footer
 *
 * ```html
 * <system-modal size="large">
 * <system-modal-header (close)="closeModal()">
 * {{modalHeader}}
 * </system-modal-header>
 * <system-modal-content margin="none" #modalContent viewprovider>
 * </system-modal-content>
 * <system-modal-footer>
 * <button class="slds-button slds-button--neutral" (click)="closeModal()">{{language.getLabel('LBL_CANCEL')}}</button>
 * <button class="slds-button slds-button--brand" (click)="save()">{{language.getLabel('LBL_SAVE')}}</button>
 * </system-modal-footer>
 * </system-modal>
 * ``
 */
@Component({
    selector: 'system-modal',
    templateUrl: '../templates/systemmodal.html',
    animations: [
        trigger('modalanimation', [
            transition(':enter', [
                style({opacity: 0}),
                animate('.3s', style({opacity: 1}))
            ]),
            transition(':leave', [
                animate('.3s', style({opacity: 0}))
            ])
        ])
    ]
})
export class SystemModal {

    /**
     * the size of the modal tobe rendered
     */
    @Input() public size: 'prompt' | 'small' | 'medium' | 'large' = 'medium';

    /**
     * additonal classes that are put in and are rendered with the modal
     */
    @Input() public class: string = '';

    constructor(public metadata: metadata, public layout: layout) {

    }

    /**
     * @ignore
     *
     * helper function to get the classes for the template
     */
    get sizeClass() {
        if (this.size && this.size != 'small') {
            return this.class + ' slds-modal_' + this.size;
        }

        return this.class;
    }

    /**
     * make the modal full screen on small screens
     */
    get containerStyle() {
        if (this.layout.screenwidth == 'small') {
            return {
                'padding': '0px',
                'margin': '0px',
                'border-radius': '0px'
            };
        } else {
            return {};
        }
    }

}

