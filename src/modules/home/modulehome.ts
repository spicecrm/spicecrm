/**
 * @module ModuleHome
 */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule}   from '@angular/forms';
import {VersionManagerService} from '../../services/versionmanager.service';


import {ObjectFields}      from '../../objectfields/objectfields';
import {GlobalComponents}      from '../../globalcomponents/globalcomponents';
import {ObjectComponents}      from '../../objectcomponents/objectcomponents';
import {SystemComponents}      from '../../systemcomponents/systemcomponents';
import {DirectivesModule} from "../../directives/directives";


import /*embed*/ {Home} from './components/home';
import /*embed*/ {HomeAssistant} from './components/homeassistant';
import /*embed*/ {HomeAssistantTile} from './components/homeassistanttile';
import /*embed*/ {HomeAssistantFilter} from './components/homeassistantfilter';
import /*embed*/ {HomeDashboard} from './components/homedashboard';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        GlobalComponents,
        ObjectComponents,
        SystemComponents,
        DirectivesModule
    ],
    declarations: [
        Home,
        HomeAssistant,
        HomeAssistantTile,
        HomeAssistantFilter,
        HomeDashboard
    ]
})
export class ModuleHome {
    readonly version = '1.0';
    readonly build_date = '/*build_date*/';

    constructor(
        private vms: VersionManagerService,
    ) {
        this.vms.registerModule(this);
    }
}