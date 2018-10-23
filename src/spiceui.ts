import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";
import {BrowserModule, Title} from "@angular/platform-browser";
import {
    NgModule,
    Component,
    SystemJsNgModuleLoader,
    Injectable,
    NgModuleFactory,
    NgModuleFactoryLoader,
    Compiler
} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";


// spicecrm generic modules
import {SystemComponents}      from "./systemcomponents/systemcomponents";
import {GlobalComponents}      from "./globalcomponents/globalcomponents";
import {ObjectComponents} from "./objectcomponents/objectcomponents";


// support browser location strategy
import {LocationStrategy, HashLocationStrategy} from "@angular/common";
// import {AdminComponentsModule, AdministrationMain} from "./admincomponents/admincomponents.module";

// various services we need on global app level
import {configurationService} from "./services/configuration.service";
import {loginService, loginCheck} from "./services/login.service";
import {session} from "./services/session.service";
import {metadata, aclCheck} from "./services/metadata.service";
import {AppDataService} from "./services/appdata.service";
import {MathExpressionCompilerService} from "./services/mathexpressioncompiler";
import {language} from "./services/language.service";
import {recent} from "./services/recent.service";
import {userpreferences} from "./services/userpreferences.service";
import {fts} from "./services/fts.service";
import {loader} from "./services/loader.service";
import {broadcast} from "./services/broadcast.service";
import {dockedComposer} from "./services/dockedcomposer.service";
import {backend} from "./services/backend.service";
import {navigation} from "./services/navigation.service";
import {modelutilities} from "./services/modelutilities.service";
import {toast} from "./services/toast.service";
import {favorite} from "./services/favorite.service";
import {reminder} from "./services/reminder.service";
import {territories} from "./services/territories.service";
import {currency} from "./services/currency.service";
import {footer} from "./services/footer.service";
import {cookie} from "./services/cookie.service";
import {assistant} from "./services/assistant.service";
import {VersionManagerService} from "./services/versionmanager.service";
import {modal} from "./services/modal.service";

// declarations for TS
declare var System: any;
declare var moment: any;
declare global {
    interface Date {
        format(format): string;
    }
};

moment.defaultFormat = "YYYY-MM-DD HH:mm:ss";

@Component({
    selector: "spicecrm",
    template: "<global-header></global-header><div class=\"spiceContent\"><router-outlet></router-outlet></div><global-footer></global-footer>"
})
export class SpiceUI {

}

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        SystemComponents,
        GlobalComponents,
        ObjectComponents,
        RouterModule.forRoot(
            [
                {path: "", redirectTo: "/module/Home", pathMatch: "full"},
            ]
        )
    ],
    declarations: [SpiceUI],
    entryComponents: [],
    bootstrap: [SpiceUI],
    providers: [
        {provide: LocationStrategy, useClass: HashLocationStrategy},
        backend,
        broadcast,
        navigation,
        session,
        metadata,
        AppDataService,
        aclCheck,
        loginCheck,
        loginService,
        loader,
        configurationService,
        language,
        dockedComposer,
        fts,
        recent,
        SystemJsNgModuleLoader,
        modelutilities,
        toast,
        favorite,
        reminder,
        territories,
        currency,
        footer,
        userpreferences,
        cookie,
        MathExpressionCompilerService,
        assistant,
        VersionManagerService,
        modal,
        Title
    ]
})
export class SpiceUIModule {
    public version = "1.0";
    public build_date = "/*build_date*/";

    constructor(
        public metadata: metadata,
        private vms: VersionManagerService,
    ) {
        this.vms.registerModule(this);
    }
}


// set prod mode
/*
 import {enableProdMode} from "@angular/core";
 enableProdMode();
 */

const platform = platformBrowserDynamic();
platform.bootstrapModule(SpiceUIModule);

;