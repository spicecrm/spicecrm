/**
 * Components to be used when SpiceUI is also pulished externally as Portal
 *
 * @module PortalComponents
 */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule}   from '@angular/forms';

import {ObjectFields}      from '../objectfields/objectfields';
import {GlobalComponents}      from '../globalcomponents/globalcomponents';
import {ObjectComponents}      from '../objectcomponents/objectcomponents';
import {SystemComponents}      from '../systemcomponents/systemcomponents';

import { PortalStart } from './components/portalstart';
import { PortalCases } from './components/portalcases';
import { PortalInfoSlider } from './components/portalinfoslider';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        GlobalComponents,
        ObjectComponents,
        SystemComponents,
        ],
    declarations: [
        PortalStart,
        PortalCases,
        PortalInfoSlider
    ]
})
export class PortalComponents {
}
