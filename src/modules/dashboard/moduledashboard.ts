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
import {VersionManagerService} from "../../services/versionmanager.service";

import {ObjectFields} from "../../objectfields/objectfields";
import {SystemComponents} from "../../systemcomponents/systemcomponents";

import /*embed*/ {dashboardlayout} from "./services/dashboardlayout.service";
import /*embed*/ {DashboardView} from "./components/dashboardview";
import /*embed*/ {DashboardSelectPanel} from "./components/dashboardselectpanel";
import /*embed*/ {DashboardContainer} from "./components/dashboardcontainer";
import /*embed*/ {DashboardContainerHeader} from "./components/dashboardcontainerheader";
import /*embed*/ {DashboardContainerHomeHeader} from "./components/dashboardcontainerhomeheader";
import /*embed*/ {DashboardContainerBody} from "./components/dashboardcontainerbody";
import /*embed*/ {DashboardContainerElement} from "./components/dashboardcontainerelement";
import /*embed*/ {DashboardAddElement} from "./components/dashboardaddelement";
import /*embed*/ {DashboardWeatherDashlet} from "./components/dashboardweatherdashlet";
import /*embed*/ {DashboardGenericDashlet} from "./components/dashboardgenericdashlet";
import /*embed*/ {DashboardGenericDashletRow} from "./components/dashboardgenericdashletrow";
import /*embed*/ {DashboardRemindersDashlet} from "./components/dashboardremindersdashlet";
import /*embed*/ {DashboardComponentset} from "./components/dashboardcomponentset";

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
    ],
    exports: [
        DashboardContainer,
    ]
})
export class ModuleDashboard {
    public readonly version = "1.0";
    public readonly build_date = "/*build_date*/";

    constructor(
        public metadata: metadata,
        private vms: VersionManagerService,
    ) {
        this.vms.registerModule(this);
    }
}