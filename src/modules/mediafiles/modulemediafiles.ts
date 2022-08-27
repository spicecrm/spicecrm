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

import {MediaFileImage} from './components/mediafileimage';
import {MediaFilePicker} from './components/mediafilepicker';
import {MediaFileUploader} from './components/mediafileuploader';
import {MediaFilesList} from './components/mediafileslist';
import {MediaFilesTile} from './components/mediafilestile';
import {fieldMediaFilesImage} from './fields/fieldmediafilesimage';
import {fieldMediaFile} from './fields/fieldmediafile';
import {fieldMediaFileImage} from './fields/fieldmediafileimage';

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
