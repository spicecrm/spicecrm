/**
 * @module SpiceInstallerModule
 */
import {CommonModule} from "@angular/common";
import {FormsModule}   from "@angular/forms";
import {DirectivesModule} from "../../directives/directives";
import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import /*embed*/ {spiceinstaller} from "./services/spiceinstaller.service";
import {SystemComponents} from "../../systemcomponents/systemcomponents";


import /*embed*/ {SpiceInstaller} from "./components/spiceinstaller";
import /*embed*/ {SpiceInstallerProgressIndicator} from "./components/spiceinstallerprogressindicator";
import /*embed*/ {SpiceInstallerDetailContainer} from "./components/spiceinstallerdetailcontainer";
import /*embed*/ {SpiceInstallerSetBackEnd} from "./components/spiceinstallersetbackend";
import /*embed*/ {SpiceInstallerDatabase} from "./components/spiceinstallerdatatabase";
import /*embed*/ {SpiceInstallerFTS} from "./components/spiceinstallerfts";
import /*embed*/ {SpiceInstallerSystemCheck} from "./components/spiceinstallersystemcheck";
import /*embed*/ {SpiceInstallerLicence} from "./components/spiceinstallerlicence";
import /*embed*/ {SpiceInstallerCredentials} from "./components/spiceinstallercredentials";
import /*embed*/ {SpiceInstallerSetLanguage} from "./components/spiceinstallersetlanguage";
import /*embed*/ {SpiceInstallerReview} from "./components/spiceinstallerreview";
import /*embed*/ {SpiceinstallerMySQLi} from "./components/spiceinstallermysqli";
import /*embed*/ {SpiceinstallerPostgreSQL} from "./components/spiceinstallerpgsql";
import /*embed*/ {SpiceinstallerOCI8} from "./components/spiceinstalleroci8";


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        DirectivesModule,
        SystemComponents,
        RouterModule.forRoot([
            {path: "install", component: SpiceInstaller}
        ])],
    declarations: [
        SpiceInstaller,
        SpiceInstallerProgressIndicator,
        SpiceInstallerDetailContainer,
        SpiceInstallerSetBackEnd,
        SpiceInstallerSystemCheck,
        SpiceInstallerLicence,
        SpiceInstallerDatabase,
        SpiceinstallerMySQLi,
        SpiceinstallerPostgreSQL,
        SpiceinstallerOCI8,
        SpiceInstallerFTS,
        SpiceInstallerCredentials,
        SpiceInstallerSetLanguage,
        SpiceInstallerReview
    ],
    providers: [spiceinstaller]
})

export class SpiceInstallerModule {}
