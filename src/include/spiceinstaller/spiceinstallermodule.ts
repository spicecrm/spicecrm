/**
 * @module SpiceInstallerModule
 */
import {CommonModule} from "@angular/common";
import {FormsModule}   from "@angular/forms";
import {DirectivesModule} from "../../directives/directives";
import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {spiceinstaller} from "./services/spiceinstaller.service";
import {VersionManagerService} from "../../services/versionmanager.service";
import {SystemComponents} from "../../systemcomponents/systemcomponents";


import /*embed*/ {SpiceInstaller} from "./components/spiceinstaller";
import /*embed*/ {SpiceInstallerProgressIndicator} from "./components/spiceinstallerprogressindicator";
import /*embed*/ {SpiceInstallerDetailContainer} from "./components/spiceinstallerdetailcontainer";
import /*embed*/ {SpiceInstallerSetBackEnd} from "./components/spiceinstallersetbackend";
import /*embed*/ {SpiceInstallerDatabase} from "./components/spiceinstallerdatatabase";
import /*embed*/ {SpiceInstallerFTS} from "./components/spiceinstallerfts";
import /*embed*/ {SpiceInstallerSystemCheck} from "./components/spiceinstallersystemcheck";
import /*embed*/ {SpiceInstallerLicence} from "./components/spiceinstallerlicence";
import /*embed*/ {SpiceInstallerReference} from "./components/spiceinstallerreference";
import /*embed*/ {SpiceInstallerReview} from "./components/spiceinstallerreview";


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        DirectivesModule,
        SystemComponents,
        RouterModule.forRoot([
            // {path: "login", component: GlobalLogin},
            {path: "install", component: SpiceInstaller}
            /*
            {path: "recent", component: GlobalRecentItems, canActivate: [loginCheck]},
            {path: "search", component: GlobalSearch, canActivate: [loginCheck]},
            {path: "search/:searchterm", component: GlobalSearch, canActivate: [loginCheck]},
            */
        ])],
    declarations: [
        SpiceInstaller,
        SpiceInstallerProgressIndicator,
        SpiceInstallerDetailContainer,
        SpiceInstallerSetBackEnd,
        SpiceInstallerSystemCheck,
        SpiceInstallerLicence,
        SpiceInstallerDatabase,
        SpiceInstallerFTS,
        SpiceInstallerReference,
        SpiceInstallerReview
    ],
    providers: [spiceinstaller]
})

export class SpiceInstallerModule {
    public readonly version = '1.0';
    public readonly build_date = '/*build_date*/';

    constructor(
        private vms: VersionManagerService,
    ) {
        vms.registerModule(this);
    }
}
