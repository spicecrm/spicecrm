import {NgModule} from '@angular/core';
import {SpiceDiagram} from "./components/spicediagram";
import {SpiceDiagramViewer} from "./components/spicediagramviewer";
import {DirectivesModule} from "../../directives/directives";

@NgModule({
    imports: [
        DirectivesModule
    ],
    exports: [
        SpiceDiagram,
        SpiceDiagramViewer
    ],
    declarations: [
        SpiceDiagram,
        SpiceDiagramViewer
    ],
    providers: [],
})
export class ModuleSpiceDiagrams {
}
