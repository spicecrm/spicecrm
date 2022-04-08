/**
 * a set of system specific directives
 *
 * @module DirectivesModule
 */
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";

import /*embed*/ {SystemModelPopOverDirective} from "./directives/systemmodelpopover";
import /*embed*/ {SystemPopOverDirective} from "./directives/systempopover";
import /*embed*/ {SystemModelProviderDirective} from "./directives/systemmodelprovider";
import /*embed*/ {SystemAutofocusDirective} from "./directives/systemautofocus";
import /*embed*/ {SystemDropdownTriggerDirective} from "./directives/systemdropdowntrigger";
import /*embed*/ {SystemDropdownTriggerButtonDirective} from "./directives/systemdropdowntriggerbutton";
import /*embed*/ {SystemDropdownTriggerSimpleDirective} from "./directives/systemdropdowntriggersimple";
import /*embed*/ {SystemToBottomDirective} from "./directives/systemtobottom";
import /*embed*/ {SystemToBottomNoScrollDirective} from "./directives/systemtobottomnoscroll";
import /*embed*/ {SystemTrimInputDirective} from './directives/systemtriminput';
import /*embed*/ {SystemViewProviderDirective} from './directives/systemviewprovider';
import /*embed*/ {SystemDropFile} from './directives/systemdropfile';
import /*embed*/ {SystemOverlayLoadingSpinnerDirective} from './directives/systemoverlayloadingspinner';
import /*embed*/ {SystemResizeDirective} from './directives/systemresize';
import /*embed*/ {SystemTitleDirective} from './directives/systemtitle';
import /*embed*/ {SystemPlaceholderDirective} from './directives/systemplaceholder';
import /*embed*/ {SystemMultiSelectCheckboxesDirective} from './directives/systemmultiselectcheckboxes';
import /*embed*/ {SystemCalculatorTriggerDirective} from './directives/systemcalculatortrigger';

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
        SystemCalculatorTriggerDirective
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
        SystemCalculatorTriggerDirective
    ]
})
export class DirectivesModule {
}
