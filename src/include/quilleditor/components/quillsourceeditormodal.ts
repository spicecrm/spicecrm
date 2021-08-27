/**
 * @module QuillEditorModule
 */

import {Component} from '@angular/core';
import {SystemRichTextSourceModal} from "../../../systemcomponents/components/systemrichtextsourcemodal";


/**
 * render a quill rich text editor and handle its changes
 */
@Component({
    selector: 'quill-source-editor-modal',
    templateUrl: './src/include/quilleditor/templates/quillsourceeditormodal.html'
})
export class QuillSourceEditorModal extends SystemRichTextSourceModal {

}
