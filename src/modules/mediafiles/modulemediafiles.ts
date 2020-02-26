/**
 * @module ModuleMediaFiles
 */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule}   from '@angular/forms';

import {ObjectFields}               from '../../objectfields/objectfields';
import {GlobalComponents}           from '../../globalcomponents/globalcomponents';
import {ObjectComponents}           from '../../objectcomponents/objectcomponents';
import {SystemComponents}           from '../../systemcomponents/systemcomponents';

import /*embed*/ {MediaFileImage}       from './components/mediafileimage';
import /*embed*/ {MediaFilePicker}      from './components/mediafilepicker';
import /*embed*/ {MediaFileUploader}    from './components/mediafileuploader';

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
        MediaFileImage,
        MediaFilePicker,
        MediaFileUploader
    ],
    exports: [
        MediaFileImage,
        MediaFilePicker,
        MediaFileUploader
    ]
})
export class ModuleMediaFiles {}
