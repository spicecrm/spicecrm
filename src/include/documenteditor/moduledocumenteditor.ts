import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {SystemComponents} from "../../systemcomponents/systemcomponents";
import {DirectivesModule} from "../../directives/directives";
import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {ObjectFields} from "../../objectfields/objectfields";
import {DocumentFileEditor} from "./components/documentfileeditor";
import {DocumentEditor} from "./components/documenteditor";
import {DocumentFileEditorStandalone} from "./components/documentfileeditorstandalone";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SystemComponents,
        DirectivesModule,
        GlobalComponents,
        ObjectComponents,
        ObjectFields,
    ],
    declarations: [
        DocumentEditor,
        DocumentFileEditor,
        DocumentFileEditorStandalone
    ],
    providers: [],
})
export class ModuleDocumentEditor {
}