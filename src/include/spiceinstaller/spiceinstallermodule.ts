/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
