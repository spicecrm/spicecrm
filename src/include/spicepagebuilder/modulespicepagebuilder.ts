/**
 * @module ModuleSpicePageBuilder
 */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {ObjectFields} from '../../objectfields/objectfields';
import {SystemComponents} from '../../systemcomponents/systemcomponents';

import * as interfaces from './interfaces/spicepagebuilder.interfaces';

import {SpicePageBuilderService} from './services/spicepagebuilder.service';

import {SpicePageBuilderInputText} from './components/spicepagebuilderinputtext';
import {SpicePageBuilderInputWidth} from './components/spicepagebuilderinputwidth';
import {SpicePageBuilderInputSides} from './components/spicepagebuilderinputsides';
import {SpicePageBuilderInputColor} from './components/spicepagebuilderinputcolor';
import {SpicePageBuilderInputBorder} from "./components/spicepagebuilderinputborder";
import {SpicePageBuilderInputHorizontalAlign} from "./components/spicepagebuilderinputhorizontalalign";
import {SpicePageBuilderInputTextDecoration} from "./components/spicepagebuilderinputtextdecoration";
import {SpicePageBuilderInputFontStyle} from "./components/spicepagebuilderinputfontstyle";
import {SpicePageBuilderInputFontWeight} from "./components/spicepagebuilderinputfontweight";
import {SpicePageBuilderInputDirection} from "./components/spicepagebuilderinputdirection";
import {SpicePageBuilderElement} from './components/spicepagebuilderelement';
import {SpicePageBuilderElementImage} from './components/spicepagebuilderelementimage';
import {SpicePageBuilderElementText} from './components/spicepagebuilderelementtext';
import {SpicePageBuilderElementDivider} from './components/spicepagebuilderelementdivider';
import {SpicePageBuilderElementSpacer} from './components/spicepagebuilderelementspacer';
import {SpicePageBuilderElementButton} from './components/spicepagebuilderelementbutton';
import {SpicePageBuilderElementCode} from './components/spicepagebuilderelementcode';
import {SpicePageBuilderElementColumn} from './components/spicepagebuilderelementcolumn';
import {SpicePageBuilderElementSection} from './components/spicepagebuilderelementsection';
import {SpicePageBuilderElementBody} from './components/spicepagebuilderelementbody';
import {SpicePageBuilderRenderer} from './components/spicepagebuilderrenderer';
import {SpicePageBuilderPanel} from './components/spicepagebuilderpanel';
import {SpicePageBuilderEditor} from './components/spicepagebuildereditor';
import {SpicePageBuilder} from './components/spicepagebuilder';

import {fieldPageBuilder} from './fields/fieldpagebuilder';

import {FormsModule} from "@angular/forms";
import {DirectivesModule} from "../../directives/directives";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {SpicePageBuilderElementRSS} from "./components/spicepagebuilderelementrss";
import {SpicePageBuilderElementHeading} from "./components/spicepagebuilderelementheading";
import {SpicePageBuilderElementAttributes} from "./components/spicepagebuilderelementattributes";



@NgModule({
    declarations: [
        SpicePageBuilder,
        SpicePageBuilderPanel,
        SpicePageBuilderRenderer,
        SpicePageBuilderElement,
        SpicePageBuilderElementAttributes,
        SpicePageBuilderInputText,
        SpicePageBuilderInputWidth,
        SpicePageBuilderInputHorizontalAlign,
        SpicePageBuilderInputTextDecoration,
        SpicePageBuilderInputSides,
        SpicePageBuilderInputBorder,
        SpicePageBuilderInputColor,
        SpicePageBuilderInputFontStyle,
        SpicePageBuilderInputFontWeight,
        SpicePageBuilderInputDirection,
        SpicePageBuilderEditor,
        SpicePageBuilderElement,
        SpicePageBuilderElementBody,
        SpicePageBuilderElementSection,
        SpicePageBuilderElementColumn,
        SpicePageBuilderElementImage,
        SpicePageBuilderElementText,
        SpicePageBuilderElementHeading,
        SpicePageBuilderElementDivider,
        SpicePageBuilderElementSpacer,
        SpicePageBuilderElementButton,
        SpicePageBuilderElementCode,
        SpicePageBuilderElementRSS,
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
