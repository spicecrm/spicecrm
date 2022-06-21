/**
 * @module QuillEditorModule
 */

import {CommonModule} from '@angular/common';
import {ModuleWithProviders, NgModule} from '@angular/core';

import {ObjectFields} from '../../objectfields/objectfields';
import {SystemComponents} from '../../systemcomponents/systemcomponents';

import {QuillViewContainer} from './components/quillviewcontainer';
import {QuillEditorContainer} from './components/quilleditorcontainer';
import {QuillSourceEditorModal} from "./components/quillsourceeditormodal";

import {fieldQuillRichText} from "./fields/fieldquillrichtext";

import {QuillModulesI, QuillToolbarConfigT} from './interfaces/quilleditor.interfaces';
import {FormsModule} from "@angular/forms";
import {DirectivesModule} from "../../directives/directives";

@NgModule({
    declarations: [
        QuillEditorContainer,
        QuillViewContainer,
        fieldQuillRichText,
        QuillSourceEditorModal
    ],
    exports: [
        QuillEditorContainer,
        QuillViewContainer
    ],
    imports: [
        CommonModule,
        ObjectFields,
        SystemComponents,
        FormsModule,
        DirectivesModule
    ]
})
export class QuillEditorModule {
}
