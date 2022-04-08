/**
 * @module ModuleMediaFiles
 */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {ObjectFields} from '../../objectfields/objectfields';
import {GlobalComponents} from '../../globalcomponents/globalcomponents';
import {ObjectComponents} from '../../objectcomponents/objectcomponents';
import {SystemComponents} from '../../systemcomponents/systemcomponents';
import {DirectivesModule} from "../../directives/directives";

import /*embed*/ {MediaFileImage} from './components/mediafileimage';
import /*embed*/ {MediaFilePicker} from './components/mediafilepicker';
import /*embed*/ {MediaFileUploader} from './components/mediafileuploader';
import /*embed*/ {MediaFilesList} from './components/mediafileslist';
import /*embed*/ {MediaFilesTile} from './components/mediafilestile';
import /*embed*/ {fieldMediaFilesImage} from './fields/fieldmediafilesimage';
import /*embed*/ {fieldMediaFile} from './fields/fieldmediafile';
import /*embed*/ {fieldMediaFileImage} from './fields/fieldmediafileimage';

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
        MediaFileImage,
        MediaFilePicker,
        MediaFileUploader,
        MediaFilesList,
        MediaFilesTile,
        fieldMediaFilesImage,
        fieldMediaFile,
        fieldMediaFileImage
    ],
    exports: [
        MediaFileImage,
        MediaFilePicker,
        MediaFileUploader
    ]
})
export class ModuleMediaFiles {
}
