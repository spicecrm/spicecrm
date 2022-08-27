/**
 * @module ModuleCurrencies
 */

import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {ObjectFields} from '../../objectfields/objectfields';
import {GlobalComponents} from '../../globalcomponents/globalcomponents';
import {ObjectComponents} from '../../objectcomponents/objectcomponents';
import {SystemComponents} from '../../systemcomponents/systemcomponents';
import {DirectivesModule} from "../../directives/directives";
import {FormsModule} from "@angular/forms";

import {CurrencyManager} from "./components/currencymanager";
import {AddCurrencyItem} from "./components/addcurrencyitem";
import {SystemCurrency} from "./components/systemcurrency";
import {CurrencyList} from "./components/currencylist";




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
        CurrencyManager,
        CurrencyList,
        AddCurrencyItem,
        SystemCurrency
    ]
})
export class ModuleCurrencies {}
