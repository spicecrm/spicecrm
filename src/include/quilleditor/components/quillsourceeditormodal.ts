/**
 * @module QuillEditorModule
 */

import {Component} from '@angular/core';
import {SystemRichTextSourceModal} from "../../../systemcomponents/components/systemrichtextsourcemodal";
import {systemrichtextservice} from "../../../systemcomponents/services/systemrichtext.service";


/**
 * render a quill rich text editor and handle its changes
 */
@Component({
    selector: 'quill-source-editor-modal',
    templateUrl: '../templates/quillsourceeditormodal.html',
    providers: [systemrichtextservice]
})
export class QuillSourceEditorModal extends SystemRichTextSourceModal {

}
