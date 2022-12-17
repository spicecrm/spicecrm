/**
 * @module SpiceInstallerModule
 */
import {CommonModule} from "@angular/common";
import {FormsModule}   from "@angular/forms";
import {DirectivesModule} from "../../directives/directives";
import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {spiceinstaller} from "./services/spiceinstaller.service";
import {SystemComponents} from "../../systemcomponents/systemcomponents";


import {SpiceInstaller} from "./components/spiceinstaller";
import {SpiceInstallerProgressIndicator} from "./components/spiceinstallerprogressindicator";
import {SpiceInstallerDetailContainer} from "./components/spiceinstallerdetailcontainer";
import {SpiceInstallerSetBackEnd} from "./components/spiceinstallersetbackend";
import {SpiceInstallerDatabase} from "./components/spiceinstallerdatatabase";
import {SpiceInstallerFTS} from "./components/spiceinstallerfts";
import {SpiceInstallerSystemCheck} from "./components/spiceinstallersystemcheck";
import {SpiceInstallerLicence} from "./components/spiceinstallerlicence";
import {SpiceInstallerCredentials} from "./components/spiceinstallercredentials";
import {SpiceInstallerSetPreferences} from "./components/spiceinstallersetpreferences";
import {SpiceInstallerReview} from "./components/spiceinstallerreview";
import {SpiceinstallerMySQLi} from "./components/spiceinstallermysqli";
import {SpiceinstallerPostgreSQL} from "./components/spiceinstallerpgsql";
import {SpiceinstallerOCI8} from "./components/spiceinstalleroci8";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        DirectivesModule,
        SystemComponents
    ],
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
        SpiceInstallerSetPreferences,
        SpiceInstallerReview
    ],
    exports:[
        SpiceInstaller
    ],
    providers: [spiceinstaller]
})

export class SpiceInstallerModule {}
