import {CommonModule} from "@angular/common";
import {NgModule,Directive, Input, HostListener, OnDestroy, ElementRef, OnInit, TemplateRef, ViewContainerRef} from "@angular/core";
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
    ],
    exports: [
        ModelPopOverDirective,
        SpiceUIToBottomDirective,
        ModelProviderDirective,
        LocalVariableDirective,
        SpiceUIAutofocusDirective,
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