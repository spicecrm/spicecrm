/**
 * @module ModuleHome
 */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {ObjectFields} from '../../objectfields/objectfields';
import {GlobalComponents} from '../../globalcomponents/globalcomponents';
import {ObjectComponents} from '../../objectcomponents/objectcomponents';
import {SystemComponents} from '../../systemcomponents/systemcomponents';
import {DirectivesModule} from "../../directives/directives";
import {ModuleActivities} from "../activities/moduleactivities";

import /*embed*/ {Home} from './components/home';
import /*embed*/ {HomeAssistant} from './components/homeassistant';
import /*embed*/ {HomeAssistantTile} from './components/homeassistanttile';
import /*embed*/ {HomeAssistantFilter} from './components/homeassistantfilter';
import /*embed*/ {HomeDashboard} from './components/homedashboard';
import /*embed*/ {HomeDashboardSetContainer} from './components/homedashboardsetcontainer';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        GlobalComponents,
        ObjectComponents,
        SystemComponents,
        DirectivesModule,
        ModuleActivities
    ],
    declarations: [
        Home,
        HomeAssistant,
        HomeAssistantTile,
        HomeAssistantFilter,
        HomeDashboard,
        HomeDashboardSetContainer
    ]
})
export class ModuleHome {}
