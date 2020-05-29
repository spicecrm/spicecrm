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
import /*embed*/ {PriceConditionsByCondition} from './components/priceconditionsbycondition';
import /*embed*/ {PriceConditionsConditionsList} from './components/priceconditionsconditionslist';
import /*embed*/ {PriceConditionsByDetermination} from './components/priceconditionsbydetermination';
import /*embed*/ {PriceConditionsByDeterminationList} from './components/priceconditionsbydeterminationlist';

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
        PriceConditionsByCondition,
        PriceConditionsConditionsList,
        PriceConditionsByDetermination,
        PriceConditionsByDeterminationList
    ]
})
export class ModulePriceConditions {}
