/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module ModuleSpicePageBuilder
 */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {ObjectFields} from '../../objectfields/objectfields';
import {SystemComponents} from '../../systemcomponents/systemcomponents';

import /*embed*/ * as interfaces from './interfaces/spicepagebuilder.interfaces';

import /*embed*/ {SpicePageBuilderService} from './services/spicepagebuilder.service';

import /*embed*/ {SpicePageBuilderInputText} from './components/spicepagebuilderinputtext';
import /*embed*/ {SpicePageBuilderInputSides} from './components/spicepagebuilderinputsides';
import /*embed*/ {SpicePageBuilderInputColor} from './components/spicepagebuilderinputcolor';
import /*embed*/ {SpicePageBuilderElement} from './components/spicepagebuilderelement';
import /*embed*/ {SpicePageBuilderElementImage} from './components/spicepagebuilderelementimage';
import /*embed*/ {SpicePageBuilderElementText} from './components/spicepagebuilderelementtext';
import /*embed*/ {SpicePageBuilderElementDivider} from './components/spicepagebuilderelementdivider';
import /*embed*/ {SpicePageBuilderElementSpacer} from './components/spicepagebuilderelementspacer';
import /*embed*/ {SpicePageBuilderElementButton} from './components/spicepagebuilderelementbutton';
import /*embed*/ {SpicePageBuilderElementCode} from './components/spicepagebuilderelementcode';
import /*embed*/ {SpicePageBuilderElementColumn} from './components/spicepagebuilderelementcolumn';
import /*embed*/ {SpicePageBuilderElementSection} from './components/spicepagebuilderelementsection';
import /*embed*/ {SpicePageBuilderElementBody} from './components/spicepagebuilderelementbody';
import /*embed*/ {SpicePageBuilderRenderer} from './components/spicepagebuilderrenderer';
import /*embed*/ {SpicePageBuilderPanel} from './components/spicepagebuilderpanel';
import /*embed*/ {SpicePageBuilderEditor} from './components/spicepagebuildereditor';
import /*embed*/ {SpicePageBuilder} from './components/spicepagebuilder';

import /*embed*/ {fieldPageBuilder} from './fields/fieldpagebuilder';

import {FormsModule} from "@angular/forms";
import {DirectivesModule} from "../../directives/directives";
import {DragDropModule} from "@angular/cdk/drag-drop";

@NgModule({
    declarations: [
        SpicePageBuilder,
        SpicePageBuilderPanel,
        SpicePageBuilderRenderer,
        SpicePageBuilderElement,
        SpicePageBuilderInputText,
        SpicePageBuilderInputSides,
        SpicePageBuilderInputColor,
        SpicePageBuilderEditor,
        SpicePageBuilderElement,
        SpicePageBuilderElementBody,
        SpicePageBuilderElementSection,
        SpicePageBuilderElementColumn,
        SpicePageBuilderElementImage,
        SpicePageBuilderElementText,
        SpicePageBuilderElementDivider,
        SpicePageBuilderElementSpacer,
        SpicePageBuilderElementButton,
        SpicePageBuilderElementCode,
        fieldPageBuilder
    ],
    exports: [
        SpicePageBuilder
    ],
    imports: [
        CommonModule,
        ObjectFields,
        SystemComponents,
        FormsModule,
        DirectivesModule,
        DragDropModule
    ]
})
export class ModuleSpicePageBuilder {
}
