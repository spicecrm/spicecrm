/**
 * @module ModuleDashboard
 */
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {DirectivesModule} from "../../directives/directives";
import {NgModule} from "@angular/core";

/**
* @ignore
*/
declare var moment: any;

import {metadata} from "../../services/metadata.service";

import {ObjectFields} from "../../objectfields/objectfields";
import {SystemComponents} from "../../systemcomponents/systemcomponents";

import {dashboardlayout} from "./services/dashboardlayout.service";
import {DashboardView} from "./components/dashboardview";
import {DashboardSelectPanel} from "./components/dashboardselectpanel";
import {DashboardContainer} from "./components/dashboardcontainer";
import {DashboardContainerHeader} from "./components/dashboardcontainerheader";
import {DashboardContainerHomeHeader} from "./components/dashboardcontainerhomeheader";
import {DashboardContainerBody} from "./components/dashboardcontainerbody";
import {DashboardContainerElement} from "./components/dashboardcontainerelement";
import {DashboardAddElement} from "./components/dashboardaddelement";
import {DashboardWeatherDashlet} from "./components/dashboardweatherdashlet";
import {DashboardGenericDashlet} from "./components/dashboardgenericdashlet";
import {DashboardGenericDashletRow} from "./components/dashboardgenericdashletrow";
import {DashboardRemindersDashlet} from "./components/dashboardremindersdashlet";
import {DashboardComponentset} from "./components/dashboardcomponentset";
import {DashboardSelectPanelAddButton} from "./components/dashboardselectpaneladdbutton";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        SystemComponents,
        DirectivesModule
    ],
    declarations: [
        DashboardView,
        DashboardSelectPanel,
        DashboardContainer,
        DashboardContainerHeader,
        DashboardContainerHomeHeader,
        DashboardContainerBody,
        DashboardContainerElement,
        DashboardAddElement,
        DashboardWeatherDashlet,
        DashboardGenericDashlet,
        DashboardGenericDashletRow,
        DashboardRemindersDashlet,
        DashboardComponentset,
        DashboardSelectPanelAddButton
    ],
    exports: [
        DashboardContainer,
    ]
})
export class ModuleDashboard {}
