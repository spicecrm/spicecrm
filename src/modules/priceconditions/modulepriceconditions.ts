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

import {priceconditonsconfiguration} from './services/priceconditonsconfiguration.service';

import {PriceConditionsAccountsPanel} from './components/priceconditionsaccountspanel';
import {PriceConditionsByCondition} from './components/priceconditionsbycondition';
import {PriceConditionsConditionsList} from './components/priceconditionsconditionslist';
import {PriceConditionsByDetermination} from './components/priceconditionsbydetermination';
import {PriceConditionsByDeterminationList} from './components/priceconditionsbydeterminationlist';

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
