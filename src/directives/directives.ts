import {CommonModule} from "@angular/common";
import {NgModule,Directive, Renderer2, Input, HostListener, HostBinding, OnDestroy, ElementRef, OnInit, TemplateRef, ViewContainerRef, Pipe, PipeTransform, Optional} from "@angular/core";
import {Router}   from '@angular/router';

import {metadata} from '../services/metadata.service';
import {footer} from '../services/footer.service';
import {model} from '../services/model.service';
import {VersionManagerService} from '../services/versionmanager.service';

import /*embed*/ {ModelPopOverDirective} from "./directives/modelpopover";
import /*embed*/ {SpiceUIToBottomDirective} from "./directives/spiceuitobottom";
import /*embed*/ {ModelProviderDirective} from "./directives/modelprovider";
import /*embed*/ {LocalVariableDirective} from "./directives/localvariable";
import /*embed*/ {SpiceUIAutofocusDirective} from "./directives/spiceuiautofocus";
import /*embed*/ {FirstUpperCasePipe} from "./directives/firstuppercase";
import /*embed*/ {DropdownTriggerDirective} from "./directives/dropdowntrigger";

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        ModelPopOverDirective,
        SpiceUIToBottomDirective,
        ModelProviderDirective,
        LocalVariableDirective,
        SpiceUIAutofocusDirective,
        FirstUpperCasePipe,
        DropdownTriggerDirective
    ],
    exports: [
        ModelPopOverDirective,
        SpiceUIToBottomDirective,
        ModelProviderDirective,
        LocalVariableDirective,
        SpiceUIAutofocusDirective,
        FirstUpperCasePipe,
        DropdownTriggerDirective
    ]
})
export class DirectivesModule {
    readonly version = '1.0';
    readonly build_date = '/*build_date*/';

    constructor(
        public metadata: metadata,
        private vms: VersionManagerService,
    ) {
        this.vms.registerModule(this);
    }
}