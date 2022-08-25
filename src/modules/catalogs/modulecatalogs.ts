import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";

// MODULEs:
import {DirectivesModule} from "../../directives/directives";
import {SystemComponents} from "../../systemcomponents/systemcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {ObjectFields} from "../../objectfields/objectfields";

// COMPONENTs:
import {fieldCatalogs} from "./components/fieldcatalogs";
import {CatalogOrdersBulkShippingButton} from "./components/catalogordersbulkshippingbutton";

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
export class ModuleCatalogs {}
