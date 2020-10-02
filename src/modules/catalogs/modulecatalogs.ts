import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";

// SERVICES:
import {VersionManagerService} from "../../services/versionmanager.service";
// MODULEs:
import {DirectivesModule} from "../../directives/directives";
import {SystemComponents} from "../../systemcomponents/systemcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {ObjectFields} from "../../objectfields/objectfields";

// COMPONENTs:
import /*embed*/ {fieldCatalogs} from "./components/fieldcatalogs";
import /*embed*/ {CatalogOrdersBulkShippingButton} from "./components/catalogordersbulkshippingbutton";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SystemComponents,
        ObjectFields,
        ObjectComponents,
        DirectivesModule,
    ],
    declarations: [
        fieldCatalogs,
        CatalogOrdersBulkShippingButton
    ]
})
export class ModuleCatalogs {
    public readonly version = "1.0";
    public readonly build_date = "/*build_date*/";

    constructor(
        private vms: VersionManagerService,
    ) {
        this.vms.registerModule(this);
    }
}
