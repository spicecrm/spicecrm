/**
 * @module ObjectComponents
 */
import {
    Component, ElementRef, Renderer2, Input, Output, OnDestroy, EventEmitter, ViewChild,
    ViewContainerRef
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';
import {popup} from '../../services/popup.service';
import {helper} from '../../services/helper.service';

@Component({
    selector: 'object-actionset-menu',
    templateUrl: '../templates/objectactionsetmenu.html',
    providers: [popup, helper]
})
export class ObjectActionsetMenu implements  OnDestroy {

    @ViewChild('acionsetcontainer', {read: ViewContainerRef, static: true}) acionsetcontainer: ViewContainerRef;

    @Input() actionset: string = '';
    @Input() buttonsize: string = '';
    @Output() action: EventEmitter<string> = new EventEmitter<string>();
    isOpen: boolean = false;
    popupSubscription: any;
    clickListener: any;

    constructor(public language: language, public model: model, public metadata: metadata, public elementRef: ElementRef, public renderer: Renderer2, public popup: popup, public helper: helper) {
        this.popupSubscription = this.popup.closePopup$.subscribe(close => {
            this.isOpen = false;
        })
    }

    ngOnDestroy() {
        this.popupSubscription.unsubscribe();
    }

    hasNoActions() {
        return false;
    }

    toggleOpen() {
        this.isOpen = !this.isOpen;

        // toggle the listener
        if (this.isOpen) {
            this.clickListener = this.renderer.listen('document', 'click', (event) => this.onClick(event));
        } else if (this.clickListener) {
            this.clickListener();
        }

    }

    public onClick(event: MouseEvent): void {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.isOpen = false;
        }
    }

    getButtonSizeClass() {
        if (this.buttonsize !== '') return 'slds-button--icon-' + this.buttonsize;
    }

    getDropdownLocationClass() {
        let rect = this.elementRef.nativeElement.getBoundingClientRect();
        if (window.innerHeight - rect.bottom < 100) return 'slds-dropdown--bottom';
    }
}
