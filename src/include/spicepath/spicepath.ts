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
 * @module ModuleSpicePath
 */
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {DragDropModule} from '@angular/cdk/drag-drop';

import {DirectivesModule} from "../../directives/directives";

import {ObjectFields} from "../../objectfields/objectfields";
import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {SystemComponents} from "../../systemcomponents/systemcomponents";

import /*embed*/ {SpiceKanbanStagePipe} from "./pipes/spicekanbanstagepipe";

import /*embed*/ {SpicePathTrack} from './components/spicepathtrack';
import /*embed*/ {SpicePathModel} from './components/spicepathmodel';
import /*embed*/ {SpicePathWithCoaching} from './components/spicepathwithcoaching';
import /*embed*/ {SpicePathRelatedListTiles} from './components/spicepathrelatedlisttiles';
import /*embed*/ {SpicePathRelatedListTile} from './components/spicepathrelatedlisttile';
import /*embed*/ {SpiceKanbanSumField} from "./components/spicekanbansumfield";
import /*embed*/ {SpiceKanban} from "./components/spicekanban";
import /*embed*/ {SpiceKanbanTile} from "./components/spicekanbantile";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        GlobalComponents,
        ObjectComponents,
        SystemComponents,
        DirectivesModule,
        DragDropModule
    ],
    declarations: [
        SpicePathTrack,
        SpicePathModel,
        SpicePathWithCoaching,
        SpicePathRelatedListTiles,
        SpicePathRelatedListTile,
        SpiceKanbanStagePipe,
        SpiceKanbanSumField,
        SpiceKanban,
        SpiceKanbanTile
    ]
})
export class ModuleSpicePath {
}
