/**
 * @module DirectivesModule
 */
import {Component, ElementRef, EventEmitter, Input, Output, Renderer2} from '@angular/core';
import {language} from "../../services/language.service";

/**
 * a directive that displays a loading spinner inside an overlay container over the parent
 */
@Component({
    selector: '[system-overlay-loading-spinner]',
    template: `
        <div *ngIf="isLoading" class="slds-align--absolute-center slds-is-relative" style="position: absolute; height: 100%; width: 100%; z-index: 999; top: 0; left: 0; background-color: rgba(0,0,0,0.25);">
            <div class="slds-grid slds-grid--vertical slds-grid--vertical-align-center">
                <div style="width: 48px; border-radius: 50%; box-shadow: 0 0 5px 0 #555; padding: .5rem; background-color: #fff; color: #080707;">
                    <div class="cssload-container">
                        <div class="cssload-double-torus" style="width: 32px; height: 32px;"></div>
                    </div>
                </div>
                <button *ngIf="cancellable" (click)="onCancel.emit()" class="slds-button slds-button--brand slds-m-top--x-small">
                    {{language.getLabel('LBL_CANCEL')}}
                </button>
            </div>
        </div>
    <ng-content></ng-content>`,
    host: {
        class: 'slds-is-relative'
    }
})
export class SystemOverlayLoadingSpinnerDirective {

    @Output() public onCancel = new EventEmitter<void>();

    constructor(
        public renderer: Renderer2,
        public language: language,
        public elementRef: ElementRef
    ) {
    }

    @Input('system-overlay-loading-spinner')
    public isLoading: boolean = false;

    @Input() public cancellable: boolean = false;
}
