/**
 * @module ModuleSpicePageBuilder
 */
import {AfterViewInit, ChangeDetectionStrategy, Component, ViewChild} from '@angular/core';
import {navigationtab} from "../../../services/navigationtab.service";
import {language} from "../../../services/language.service";
import {SpicePageBuilderService} from "../services/spicepagebuilder.service";
import {CdkDropListGroup} from "@angular/cdk/drag-drop";

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

    constructor(private language: language, private navigationtab: navigationtab, private spicePageBuilderService: SpicePageBuilderService) {
        this.setNavigationTabInfo();
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

    /**
     * set the navigation tab info data
     */
    private setNavigationTabInfo() {
        this.navigationtab.setTabInfo({
            displayname: this.language.getLabel('LBL_PAGE_BUILDER'),
            displayicon: 'builder'
        });
    }
}
