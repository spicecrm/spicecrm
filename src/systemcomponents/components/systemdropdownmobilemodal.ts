import {Component, ComponentRef, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {ModalComponentI} from "../../objectcomponents/interfaces/objectcomponents.interfaces";
import {DomPortal} from "@angular/cdk/portal";
import {Subject} from "rxjs";

@Component({
    selector: 'system-dropdown-mobile-modal',
    templateUrl: '../templates/systemdropdownmobilemodal.html'
})

export class SystemDropdownMobileModal implements ModalComponentI, OnDestroy {
    /**
     * content container
     */
    @ViewChild('contentContainer', {read: ElementRef}) public contentContainer: ElementRef;
    /**
     * dom content to be dynamically projected into the portal content outlet
     */
    public portalContent: DomPortal;
    /**
     * reference to this modal component
     */
    self: ComponentRef<SystemDropdownMobileModal>;
    /**
     * emit on destroy
     */
    public destroy$: Subject<void> = new Subject<void>();

    public ngOnDestroy() {
        this.destroy$.complete();
    }
}