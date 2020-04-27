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
import /*embed*/ {SpicePageBuilderRendererElement} from './components/spicepagebuilderrendererelement';
import /*embed*/ {SpicePageBuilderRendererImage} from './components/spicepagebuilderrendererimage';
import /*embed*/ {SpicePageBuilderRendererText} from './components/spicepagebuilderrenderertext';
import /*embed*/ {SpicePageBuilderRendererDivider} from './components/spicepagebuilderrendererdivider';
import /*embed*/ {SpicePageBuilderRendererSpacer} from './components/spicepagebuilderrendererspacer';
import /*embed*/ {SpicePageBuilderRendererButton} from './components/spicepagebuilderrendererbutton';
import /*embed*/ {SpicePageBuilderRendererCode} from './components/spicepagebuilderrenderercode';
import /*embed*/ {SpicePageBuilderRendererColumn} from './components/spicepagebuilderrenderercolumn';
import /*embed*/ {SpicePageBuilderRendererSection} from './components/spicepagebuilderrenderersection';
import /*embed*/ {SpicePageBuilderRendererContainer} from './components/spicepagebuilderrenderercontainer';
import /*embed*/ {SpicePageBuilderPanelEditor} from './components/spicepagebuilderpaneleditor';
import /*embed*/ {SpicePageBuilderPanel} from './components/spicepagebuilderpanel';
import /*embed*/ {SpicePageBuilderRenderer} from './components/spicepagebuilderrenderer';
import /*embed*/ {SpicePageBuilder} from './components/spicepagebuilder';

import {FormsModule} from "@angular/forms";
import {DirectivesModule} from "../../directives/directives";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {QuillEditorModule} from "../quilleditor/quilleditor";

@NgModule({
    declarations: [
        SpicePageBuilder,
        SpicePageBuilderPanel,
        SpicePageBuilderRendererElement,
        SpicePageBuilderInputText,
        SpicePageBuilderInputSides,
        SpicePageBuilderInputColor,
        SpicePageBuilderPanelEditor,
        SpicePageBuilderRenderer,
        SpicePageBuilderRendererContainer,
        SpicePageBuilderRendererSection,
        SpicePageBuilderRendererColumn,
        SpicePageBuilderRendererImage,
        SpicePageBuilderRendererText,
        SpicePageBuilderRendererDivider,
        SpicePageBuilderRendererSpacer,
        SpicePageBuilderRendererButton,
        SpicePageBuilderRendererCode,
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
