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
