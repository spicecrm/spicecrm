/**
 * @module ModuleSpicePageBuilder
 */
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {SpicePageBuilderService} from "../services/spicepagebuilder.service";

/** @ignore */
declare var _;

/**
 * render a set of tools and configurations to be used for building pages
 */
@Component({
    selector: 'spice-page-builder-panel-editor',
    templateUrl: './src/include/spicepagebuilder/templates/spicepagebuilderpaneleditor.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpicePageBuilderPanelEditor {
    /**
     * hold the element to be edited
     */
    public element: any = {};
    /**
     * emit the changes to the element
     */
    public response: BehaviorSubject<boolean> = new BehaviorSubject(false);
    /**
     * holds a reference to the component for destroy
     */
    public self: any = {};

    constructor(private spicePageBuilderService: SpicePageBuilderService) {
    }

    /**
     * A function that defines how to track changes for items in the iterable (ngForOf).
     * https://angular.io/api/common/NgForOf#properties
     * @param index
     * @param item
     * @return index
     */
    protected trackByFn(index, item) {
        return index;
    }

    /**
     * close the modal and pass false for no changes
     */
    private cancel() {
        this.response.next(false);
        this.response.complete();
        this.self.destroy();
    }

    /**
     * close the modal and emit response true for the element
     */
    private confirm() {
        this.response.next(true);
        this.response.complete();
        this.self.destroy();
    }
}
