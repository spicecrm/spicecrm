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

import {ScrumMain} from "./components/scrummain";
import {ScrumTree} from "./components/scrumtree";
import {ScrumTreeNode} from "./components/scrumtreenode";

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
        ScrumTreeNode
    ]
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
