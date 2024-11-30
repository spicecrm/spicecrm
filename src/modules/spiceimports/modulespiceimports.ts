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
import {SpiceImportsHeader} from "./components/spiceimportsheader";
import {DirectivesModule} from "../../directives/directives";
import {SpiceImportsView} from "./components/spiceimportsview";
import {SpiceImportsViewItems} from "./components/spiceimportsviewitems";
import {SpiceImportsViewItem} from "./components/spiceimportsviewitem";
import {SpiceImportsViewLog} from "./components/spiceimportsviewlog";
import {SpiceImportsViewLogDetails} from "./components/spiceimportsviewlogdetails";
import {SpiceImportsViewLogContainer} from "./components/spiceimportsviewlogcontainer";

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
        SpiceImports,
        SpiceImportsHeader,
        SpiceImportsList,
        SpiceImportsListItem,
        Spiceimportslogs,
        SpiceImportsView,
        SpiceImportsViewItems,
        SpiceImportsViewItem,
        SpiceImportsViewLog,
        SpiceImportsViewLogDetails,
        SpiceImportsViewLogContainer
    ],
    exports: [
        SpiceImportsViewLog
    ],
    providers: [
        spiceimportsservice
    ]
})
export class ModuleSpiceImports {}
