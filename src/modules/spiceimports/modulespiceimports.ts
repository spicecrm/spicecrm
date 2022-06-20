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
import {spiceimportsservice} from "./services/spiceimports.service";

import {SpiceImports} from './components/spiceimports';
import {SpiceImportsList} from './components/spiceimportslist';
import {SpiceImportsListItem} from './components/spiceimportslistitem';
import {Spiceimportslogs} from './components/spiceimportslogs';

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
