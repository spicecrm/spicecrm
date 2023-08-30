/**
 * a set of system specific directives
 *
 * @module DirectivesModule
 */
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";

import {SystemModelPopOverDirective} from "./directives/systemmodelpopover";
import {SystemPopOverDirective} from "./directives/systempopover";
import {SystemModelProviderDirective} from "./directives/systemmodelprovider";
import {SystemAutofocusDirective} from "./directives/systemautofocus";
import {SystemDropdownTriggerDirective} from "./directives/systemdropdowntrigger";
import {SystemDropdownTriggerButtonDirective} from "./directives/systemdropdowntriggerbutton";
import {SystemDropdownTriggerSimpleDirective} from "./directives/systemdropdowntriggersimple";
import {SystemToBottomDirective} from "./directives/systemtobottom";
import {SystemToBottomNoScrollDirective} from "./directives/systemtobottomnoscroll";
import {SystemTrimInputDirective} from './directives/systemtriminput';
import {SystemViewProviderDirective} from './directives/systemviewprovider';
import {SystemDropFile} from './directives/systemdropfile';
import {SystemOverlayLoadingSpinnerDirective} from './directives/systemoverlayloadingspinner';
import {SystemResizeDirective} from './directives/systemresize';
import {SystemTitleDirective} from './directives/systemtitle';
import {SystemPlaceholderDirective} from './directives/systemplaceholder';
import {SystemMultiSelectCheckboxesDirective} from './directives/systemmultiselectcheckboxes';
import {SystemCalculatorTriggerDirective} from './directives/systemcalculatortrigger';
import {SystemStopClickPropagationDirective} from './directives/systemstopclickpropagation';
import {SystemDropUrl} from "./directives/systemdropurl";

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
        SystemDropdownTriggerButtonDirective,
        SystemDropdownTriggerSimpleDirective,
        SystemToBottomDirective,
        SystemToBottomNoScrollDirective,
        SystemTrimInputDirective,
        SystemViewProviderDirective,
        SystemDropFile,
        SystemOverlayLoadingSpinnerDirective,
        SystemResizeDirective,
        SystemPlaceholderDirective,
        SystemTitleDirective,
        SystemMultiSelectCheckboxesDirective,
        SystemCalculatorTriggerDirective,
        SystemStopClickPropagationDirective,
        SystemDropUrl
    ],
    exports: [
        SystemModelPopOverDirective,
        SystemPopOverDirective,
        SystemModelProviderDirective,
        SystemAutofocusDirective,
        SystemDropdownTriggerDirective,
        SystemDropdownTriggerButtonDirective,
        SystemDropdownTriggerSimpleDirective,
        SystemToBottomDirective,
        SystemToBottomNoScrollDirective,
        SystemTrimInputDirective,
        SystemViewProviderDirective,
        SystemDropFile,
        SystemOverlayLoadingSpinnerDirective,
        SystemResizeDirective,
        SystemPlaceholderDirective,
        SystemTitleDirective,
        SystemMultiSelectCheckboxesDirective,
        SystemCalculatorTriggerDirective,
        SystemStopClickPropagationDirective,
        SystemDropUrl
    ]
})
export class DirectivesModule {
}
