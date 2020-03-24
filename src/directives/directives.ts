/**
 * a set of system specific directives
 *
 * @module directives
 */
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";

import {metadata} from '../services/metadata.service';
import {VersionManagerService} from '../services/versionmanager.service';

import /*embed*/ {ModelPopOverDirective} from "./directives/modelpopover";
import /*embed*/ {SystemPopOverDirective} from "./directives/systempopover";
import /*embed*/ {SpiceUIToBottomDirective} from "./directives/spiceuitobottom";
import /*embed*/ {ModelProviderDirective} from "./directives/modelprovider";
import /*embed*/ {LocalVariableDirective} from "./directives/localvariable";
import /*embed*/ {SpiceUIAutofocusDirective} from "./directives/spiceuiautofocus";
import /*embed*/ {FirstUpperCasePipe} from "./directives/firstuppercase";
import /*embed*/ {DropdownTriggerDirective} from "./directives/dropdowntrigger";
import /*embed*/ {DropdownTriggerSimpleDirective} from "./directives/dropdowntriggersimple";
import /*embed*/ {ToBottomDirective} from "./directives/tobottom";
import /*embed*/ {ToBottomNoScrollDirective} from "./directives/tobottomnoscroll";
import /*embed*/ {TrimInputDirective} from './directives/triminput';
import /*embed*/ {ViewProviderDirective} from './directives/viewprovider';
import /*embed*/ {SpiceDropFileArea} from './directives/spicedropfilearea';
import /*embed*/ {OverlayLoadingSpinner} from './directives/overlayloadingspinner';
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
        ModelPopOverDirective,
        SystemPopOverDirective,
        SpiceUIToBottomDirective,
        ModelProviderDirective,
        LocalVariableDirective,
        SpiceUIAutofocusDirective,
        FirstUpperCasePipe,
        DropdownTriggerDirective,
        DropdownTriggerSimpleDirective,
        ToBottomDirective,
        ToBottomNoScrollDirective,
        TrimInputDirective,
        ViewProviderDirective,
        SpiceDropFileArea,
        OverlayLoadingSpinner,
        SystemResizeDirective,
        SystemTitleDirective
    ],
    exports: [
        ModelPopOverDirective,
        SystemPopOverDirective,
        SpiceUIToBottomDirective,
        ModelProviderDirective,
        LocalVariableDirective,
        SpiceUIAutofocusDirective,
        FirstUpperCasePipe,
        DropdownTriggerDirective,
        DropdownTriggerSimpleDirective,
        ToBottomDirective,
        ToBottomNoScrollDirective,
        TrimInputDirective,
        ViewProviderDirective,
        SpiceDropFileArea,
        OverlayLoadingSpinner,
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
