/**
 * @module SystemComponents
 */
import {Component, EventEmitter, HostBinding, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';

/**
 * a loading spinner that can be rendered while a component is loading
 */
@Component({
    selector: 'system-spinner',
    templateUrl: '../templates/systemspinner.html'
})
export class SystemSpinner implements OnInit {

    @HostBinding('class.spice-overlay-spinner-container')
    public asOverlay: boolean = false;
    /**
     * cancel event emitter
     */
    @Output() public onCancel$ = new EventEmitter<void>();
    /**
     * the size of the spinner in pixel
     */
    @Input() public size: number = 0;

    /**
     * an optional paramater for the border with in pixel
     */
    @Input() public border: number = 0;

    /**
     * set to true to inverse the spinner color schema
     */
    @Input() public inverse: string = 'false';

    /**
     * a message to be displayed underneath the spinner
     */
    @Input() public message: string;

    /**
     * @ignore
     */
    public spinnerStyle: any = {};
    /**
     * display the cancel button
     */
    public cancellable: boolean = false;

    public ngOnInit() {
        let            styleObj = {};

        if (this.size != 0
        ) {
            this.spinnerStyle.width = this.size + 'px';
            this.spinnerStyle.height = this.size + 'px';
        }

        if (this.border != 0) {
            this.spinnerStyle['border-width'] = this.border + 'px';
        }

        if (this.inverse == 'true') {
            this.spinnerStyle['border-right-color'] = '#fff';
            this.spinnerStyle['border-left-color'] = '#fff';
            this.spinnerStyle['border-bottom-color'] = '#fff';
        }
        return styleObj;
    }

    /**
     * emit the cancel button click to the overlay host directive
     */
    public onCancel() {
        this.onCancel$.emit();
    }
}
