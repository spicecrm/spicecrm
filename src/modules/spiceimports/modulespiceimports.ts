/**
 * @module ModuleSpiceImports
 */
import {CommonModule} from '@angular/common';
import {
    NgModule
} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {ObjectFields} from '../../objectfields/objectfields';
import {GlobalComponents} from '../../globalcomponents/globalcomponents';
import {ObjectComponents} from '../../objectcomponents/objectcomponents';
import {SystemComponents} from '../../systemcomponents/systemcomponents';
import /*embed*/ {spiceimportsservice} from "./services/spiceimports.service";

import /*embed*/ {SpiceImports} from './components/spiceimports';
import /*embed*/ {SpiceImportsList} from './components/spiceimportslist';
import /*embed*/ {SpiceImportsListItem} from './components/spiceimportslistitem';
import /*embed*/ {Spiceimportslogs} from './components/spiceimportslogs';

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
        SpiceImports,
        SpiceImportsList,
        SpiceImportsListItem,
        Spiceimportslogs,
    ],
    providers: [
        spiceimportsservice
    ]
})
export class ModuleSpiceImports {}
