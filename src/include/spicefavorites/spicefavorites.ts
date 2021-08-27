/**
 * @module ModuleSpiceFavorites
 */
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";

import {DirectivesModule} from "../../directives/directives";
import {ObjectFields} from "../../objectfields/objectfields";
import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {SystemComponents} from "../../systemcomponents/systemcomponents";

import /*embed*/ {SpiceFavoritesEditModal} from './components/spicefavoriteseditmodal';
import /*embed*/ {SpiceFavoritesItem} from './components/spicefavoritesitem';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        GlobalComponents,
        ObjectComponents,
        SystemComponents,
        DirectivesModule,
    ],
    declarations: [
        SpiceFavoritesEditModal,
        SpiceFavoritesItem
    ]
})
export class ModuleSpiceFavorites {}
