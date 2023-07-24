/**
 * @module ModuleSpicePageBuilder
 */
import {ChangeDetectionStrategy, Component, ViewChild, ViewContainerRef} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {
    ButtonI,
    DividerI,
    HTMLCodeI,
    ImageI,
    RSSI,
    SectionI,
    SpacerI,
    TextI
} from "../interfaces/spicepagebuilder.interfaces";

/**
 * render a set of tools and configurations to be used for building pages
 */
@Component({
    selector: 'spice-page-builder-editor',
    templateUrl: '../templates/spicepagebuildereditor.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpicePageBuilderEditor {
    /**
     * hold the element to be edited
     */
    public element: SectionI | TextI | ImageI | ButtonI | DividerI | SpacerI | HTMLCodeI | RSSI | any;
    /**
     * emit the changes to the element
     */
    public response: BehaviorSubject<boolean> = new BehaviorSubject(false);
    /**
     * holds a reference to the component for destroy
     */
    public self: any = {};
    /**
     * code container reference to beatify
     */
    @ViewChild('codeContainer', {read: ViewContainerRef, static: false}) public codeContainer: ViewContainerRef;


    /**
     * A function that defines how to track changes for items in the iterable (ngForOf).
     * https://angular.io/api/common/NgForOf#properties
     * @param index
     * @param item
     * @return index
     */
    public trackByFn(index, item) {
        return index;
    }

    /**
     * close the modal and pass false for no changes
     */
    public cancel() {
        this.response.next(false);
        this.response.complete();
        this.self.destroy();
    }

    /**
     * close the modal and emit response true for the element
     */
    public confirm() {
        this.response.next(JSON.parse(JSON.stringify(this.element)));
        this.response.complete();
        this.self.destroy();
    }
}
