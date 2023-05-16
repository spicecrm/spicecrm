/**
 * @module ModuleSpicePageBuilder
 */
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component, EventEmitter,
    Input,
    Output,
    ViewChild
} from '@angular/core';
import {SpicePageBuilderService} from "../services/spicepagebuilder.service";
import {CdkDropListGroup} from "@angular/cdk/drag-drop";
import {TagElementI} from "../interfaces/spicepagebuilder.interfaces";
import {model} from "../../../services/model.service";

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

    @Output() public pageBuilderChange$: EventEmitter<TagElementI>;
    /**
     * reference of this component to allow destroying
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

    constructor(public spicePageBuilderService: SpicePageBuilderService, public cdRef: ChangeDetectorRef, private model: model) {
        this.pageBuilderChange$ = this.spicePageBuilderService.response;
    }

    @Input()
    set pageContent(val) {
        this.spicePageBuilderService._page = val;
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
