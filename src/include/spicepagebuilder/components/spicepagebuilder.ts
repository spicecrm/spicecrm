/**
 * @module ModuleSpicePageBuilder
 */
import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {SpicePageBuilderService} from "../services/spicepagebuilder.service";
import {CdkDropListGroup} from "@angular/cdk/drag-drop";

/**
 * render spice page builder panel and renderer
 */
@Component({
    selector: 'spice-page-builder',
    templateUrl: '../templates/spicepagebuilder.html',
    providers: [SpicePageBuilderService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpicePageBuilder implements AfterViewInit {
    /**
     * reference of this component to allow destroy
     * @public
     */
    public self: any;
    /**
     * drop list reference to manage adding new lists
     */
    @ViewChild(CdkDropListGroup, {read: CdkDropListGroup, static: false}) public dropListGroup;
    /**
     * true when the drop list group ist defined
     * @private
     */
    public dropListGroupDefined: boolean = false;

    constructor(public spicePageBuilderService: SpicePageBuilderService, public cdRef: ChangeDetectorRef) {
    }

    /**
     * call to set drop list group reference
     */
    public ngAfterViewInit() {
        this.setDropListReference();
    }

    /**
     * set drop list group reference
     */
    public setDropListReference() {
        this.spicePageBuilderService.dropListGroup = this.dropListGroup;
        this.dropListGroupDefined = true;
        this.cdRef.detectChanges();
    }
}
