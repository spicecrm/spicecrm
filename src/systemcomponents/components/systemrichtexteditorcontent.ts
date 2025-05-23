/**
 * @module SystemComponents
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewEncapsulation} from '@angular/core';

@Component({
    selector: "system-richtext-editor-content",
    template: "<ng-content></ng-content>",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class SystemRichTextEditorContent {

    constructor(private cdRef: ChangeDetectorRef) {
    cdRef.detach();
    }

}
