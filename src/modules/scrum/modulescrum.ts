/**
 * @module ModuleScrum
 */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {ObjectFields} from '../../objectfields/objectfields';
import {GlobalComponents} from '../../globalcomponents/globalcomponents';
import {ObjectComponents} from '../../objectcomponents/objectcomponents';
import {SystemComponents} from '../../systemcomponents/systemcomponents';
import {DirectivesModule} from "../../directives/directives";
import {VersionManagerService} from "../../services/versionmanager.service";

import /*embed*/ {ScrumMain} from "./components/scrummain";
import /*embed*/ {ScrumTree} from "./components/scrumtree";
import /*embed*/ {ScrumTreeNode} from "./components/scrumtreenode";
import /*embed*/ {ScrumTreeDetail} from "./components/scrumtreedetail";
import /*embed*/ {ScrumTreeItem} from "./components/scrumtreeitem";
import /*embed*/ {ScrumTreeBranch} from "./components/scrumtreebranch";
import /*embed*/ {scrum} from "./services/scrum.service";


@NgModule({
    imports: [
        CommonModule,
        ObjectFields,
        GlobalComponents,
        ObjectComponents,
        SystemComponents,
        DirectivesModule,
    ],
    declarations: [
        ScrumMain,
        ScrumTree,
        ScrumTreeNode,
        ScrumTreeBranch,
        ScrumTreeItem,
        ScrumTreeDetail
    ],
    providers: [scrum]
})
export class ModuleScrum {
    public readonly version = '1.0';
    public readonly build_date = '/*build_date*/';

    constructor(
        private vms: VersionManagerService,
    ) {
        vms.registerModule(this);
    }
}
