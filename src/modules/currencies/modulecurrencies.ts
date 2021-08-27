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

import /*embed*/ {CurrencyManager} from "./components/currencymanager";
import /*embed*/ {AddCurrencyItem} from "./components/addcurrencyitem";
import /*embed*/ {SystemCurrency} from "./components/systemcurrency";
import /*embed*/ {CurrencyList} from "./components/currencylist";




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
