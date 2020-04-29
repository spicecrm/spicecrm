/**
 * @module ModuleSpicePageBuilder
 */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {ObjectFields} from '../../objectfields/objectfields';
import {SystemComponents} from '../../systemcomponents/systemcomponents';

import /*embed*/ {SpicePageBuilderService} from './services/spicepagebuilder.service';

import /*embed*/ {SpicePageBuilderInputText} from './components/spicepagebuilderinputtext';
import /*embed*/ {SpicePageBuilderInputSides} from './components/spicepagebuilderinputsides';
import /*embed*/ {SpicePageBuilderInputColor} from './components/spicepagebuilderinputcolor';
import /*embed*/ {SpicePageBuilderElement} from './components/spicepagebuilderelement';
import /*embed*/ {SpicePageBuilderElementImage} from './components/spicepagebuilderElementimage';
import /*embed*/ {SpicePageBuilderElementText} from './components/spicepagebuilderElementtext';
import /*embed*/ {SpicePageBuilderElementDivider} from './components/spicepagebuilderElementdivider';
import /*embed*/ {SpicePageBuilderElementSpacer} from './components/spicepagebuilderElementspacer';
import /*embed*/ {SpicePageBuilderElementButton} from './components/spicepagebuilderElementbutton';
import /*embed*/ {SpicePageBuilderElementCode} from './components/spicepagebuilderElementcode';
import /*embed*/ {SpicePageBuilderElementColumn} from './components/spicepagebuilderElementcolumn';
import /*embed*/ {SpicePageBuilderElementSection} from './components/spicepagebuilderElementsection';
import /*embed*/ {SpicePageBuilderElementContainer} from './components/spicepagebuilderElementcontainer';
import /*embed*/ {SpicePageBuilderElementBody} from './components/spicepagebuilderElementbody';
import /*embed*/ {SpicePageBuilderRenderer} from './components/spicepagebuilderrenderer';
import /*embed*/ {SpicePageBuilderPanel} from './components/spicepagebuilderpanel';
import /*embed*/ {SpicePageBuilderEditor} from './components/spicepagebuildereditor';
import /*embed*/ {SpicePageBuilder} from './components/spicepagebuilder';

import {FormsModule} from "@angular/forms";
import {DirectivesModule} from "../../directives/directives";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {QuillEditorModule} from "../quilleditor/quilleditor";

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
        SpicePageBuilderElementContainer,
        SpicePageBuilderElementBody,
        SpicePageBuilderElementSection,
        SpicePageBuilderElementColumn,
        SpicePageBuilderElementImage,
        SpicePageBuilderElementText,
        SpicePageBuilderElementDivider,
        SpicePageBuilderElementSpacer,
        SpicePageBuilderElementButton,
        SpicePageBuilderElementCode,
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
        DragDropModule,
        QuillEditorModule
    ]
})
export class ModuleSpicePageBuilder {
}
