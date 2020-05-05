/**
 * a set of system specific directives
 *
 * @module DirectivesModule
 */
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";

import {VersionManagerService} from '../services/versionmanager.service';

import /*embed*/ {SystemModelPopOverDirective} from "./directives/systemmodelpopover";
import /*embed*/ {SystemPopOverDirective} from "./directives/systempopover";
import /*embed*/ {SystemModelProviderDirective} from "./directives/systemmodelprovider";
import /*embed*/ {SystemAutofocusDirective} from "./directives/systemautofocus";
import /*embed*/ {SystemDropdownTriggerDirective} from "./directives/systemdropdowntrigger";
import /*embed*/ {SystemDropdownTriggerSimpleDirective} from "./directives/systemdropdowntriggersimple";
import /*embed*/ {SystemToBottomDirective} from "./directives/systemtobottom";
import /*embed*/ {SystemToBottomNoScrollDirective} from "./directives/systemtobottomnoscroll";
import /*embed*/ {SystemTrimInputDirective} from './directives/systemtriminput';
import /*embed*/ {SystemViewProviderDirective} from './directives/systemviewprovider';
import /*embed*/ {SystemDropFile} from './directives/systemdropfile';
import /*embed*/ {SystemOverlayLoadingSpinnerDirective} from './directives/systemoverlayloadingspinner';
import /*embed*/ {SystemResizeDirective} from './directives/systemresize';
import /*embed*/ {SystemTitleDirective} from './directives/systemtitle';

/**
 * the angular module that collects all teh directives and can be imported by other modules to use the set of directives
 */
@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        SystemModelPopOverDirective,
        SystemPopOverDirective,
        SystemModelProviderDirective,
        SystemAutofocusDirective,
        SystemDropdownTriggerDirective,
        SystemDropdownTriggerSimpleDirective,
        SystemToBottomDirective,
        SystemToBottomNoScrollDirective,
        SystemTrimInputDirective,
        SystemViewProviderDirective,
        SystemDropFile,
        SystemOverlayLoadingSpinnerDirective,
        SystemResizeDirective,
        SystemTitleDirective
    ],
    exports: [
        SystemModelPopOverDirective,
        SystemPopOverDirective,
        SystemModelProviderDirective,
        SystemAutofocusDirective,
        SystemDropdownTriggerDirective,
        SystemDropdownTriggerSimpleDirective,
        SystemToBottomDirective,
        SystemToBottomNoScrollDirective,
        SystemTrimInputDirective,
        SystemViewProviderDirective,
        SystemDropFile,
        SystemOverlayLoadingSpinnerDirective,
        SystemResizeDirective,
        SystemTitleDirective
    ]
})
export class DirectivesModule {
    readonly version = '1.0';
    readonly build_date = '/*build_date*/';

    constructor(
        private vms: VersionManagerService,
    ) {
        this.vms.registerModule(this);
    }
}
