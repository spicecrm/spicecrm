import {NgModule} from '@angular/core';
import {MediaArticlesShareButton} from "./actions/mediaarticlessharebutton";
import {SystemComponents} from "../../systemcomponents/systemcomponents";
import {MediaArticlesShareModal} from "./components/mediaarticlessharemodal";
import {FormsModule} from "@angular/forms";
import {SystemTranslatePipe} from "../../systemcomponents/pipes/systemtranslate.pipe";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {CdkDrag, CdkDropList} from "@angular/cdk/drag-drop";
import {CommonModule} from "@angular/common";
import {ObjectFields} from "../../objectfields/objectfields";
import {DirectivesModule} from "../../directives/directives";

@NgModule({
    imports: [
        SystemComponents,
        FormsModule,
        SystemTranslatePipe,
        ObjectComponents,
        CdkDrag,
        CdkDropList,
        CommonModule,
        ObjectFields,
        DirectivesModule
    ],
    exports: [],
    declarations: [
        MediaArticlesShareButton,
        MediaArticlesShareModal
    ],
})
export class ModuleMediaArticles {
}
