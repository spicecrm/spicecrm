/**
 * @module ModuleSpicePageBuilder
 */
import {AfterViewInit, ChangeDetectionStrategy, Component, ViewChild} from '@angular/core';
import {navigationtab} from "../../../services/navigationtab.service";
import {language} from "../../../services/language.service";
import {SpicePageBuilderService} from "../services/spicepagebuilder.service";
import {CdkDropListGroup} from "@angular/cdk/drag-drop";
import {BehaviorSubject, Observable} from "rxjs";

/**
 * render spice page builder panel and renderer
 */
@Component({
    selector: 'spice-page-builder',
    templateUrl: './src/include/spicepagebuilder/templates/spicepagebuilder.html',
    providers: [SpicePageBuilderService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpicePageBuilder implements AfterViewInit {
    /**
     * drop list reference to manage adding new lists
     */
    @ViewChild(CdkDropListGroup, {read: CdkDropListGroup, static: false}) private dropListGroup;
    /**
     * reference of this component to allow destroy
     * @public
     */
    public self: any;

    constructor(public spicePageBuilderService: SpicePageBuilderService) {
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
    private setDropListReference() {
        this.spicePageBuilderService.dropListGroup = this.dropListGroup;
    }
}
