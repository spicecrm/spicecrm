/**
 * @module ModulePriceConditions
 */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {ObjectFields} from '../../objectfields/objectfields';
import {GlobalComponents} from '../../globalcomponents/globalcomponents';
import {ObjectComponents} from '../../objectcomponents/objectcomponents';
import {SystemComponents} from '../../systemcomponents/systemcomponents';
import {DirectivesModule} from '../../directives/directives';

import /*embed*/ {priceconditonsconfiguration} from './services/priceconditonsconfiguration.service';

import /*embed*/ {PriceConditionsAccountsPanel} from './components/priceconditionsaccountspanel';
import /*embed*/ {PriceConditionsConditionsList} from './components/priceconditionsconditionslist';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        GlobalComponents,
        ObjectComponents,
        SystemComponents,
        DirectivesModule
    ],
    declarations: [
        PriceConditionsAccountsPanel,
        PriceConditionsConditionsList
    ]
})
export class ModulePriceConditions {}
