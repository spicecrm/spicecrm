/**
 * @module ModuleSpicePageBuilder
 */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {ObjectFields} from '../../objectfields/objectfields';
import {SystemComponents} from '../../systemcomponents/systemcomponents';

import /*embed*/ {SpicePageBuilderService} from './services/spicepagebuilder.service';

import /*embed*/ {SpicePageBuilder} from './components/spicepagebuilder';
import /*embed*/ {SpicePageBuilderPanel} from './components/spicepagebuilderpanel';
import /*embed*/ {SpicePageBuilderRenderer} from './components/spicepagebuilderrenderer';
import /*embed*/ {SpicePageBuilderRendererDropZone} from './components/spicepagebuilderrendererdropzone';
import /*embed*/ {SpicePageBuilderRendererContainer} from './components/spicepagebuilderrenderercontainer';
import /*embed*/ {SpicePageBuilderRendererSection} from './components/spicepagebuilderrenderersection';
import /*embed*/ {SpicePageBuilderRendererColumn} from './components/spicepagebuilderrenderercolumn';
import /*embed*/ {SpicePageBuilderRendererImage} from './components/spicepagebuilderrendererimage';
import /*embed*/ {SpicePageBuilderRendererText} from './components/spicepagebuilderrenderertext';

import {FormsModule} from "@angular/forms";
import {DirectivesModule} from "../../directives/directives";
import {DragDropModule} from "@angular/cdk/drag-drop";

@NgModule({
    declarations: [
        SpicePageBuilder,
        SpicePageBuilderPanel,
        SpicePageBuilderRenderer,
        SpicePageBuilderRendererDropZone,
        SpicePageBuilderRendererContainer,
        SpicePageBuilderRendererSection,
        SpicePageBuilderRendererColumn,
        SpicePageBuilderRendererImage,
        SpicePageBuilderRendererText,
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
