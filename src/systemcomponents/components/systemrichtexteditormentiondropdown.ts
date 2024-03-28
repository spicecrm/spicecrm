import {Component} from '@angular/core';

@Component({
    selector: 'system-richtext-editor-mention-dropdown',
    templateUrl: '../templates/systemrichtexteditormentiondropdown.html',
    host: {
        class: 'ck-reset_all-excluded'
    }
})

export class SystemRichTextEditorMentionDropdown {
    /**
     * module name for the icon
     */
    public module: string;
    /**
     * display name
     */
    public name: string;

    public ngOnDestroy() {
        console.log('destroyed');
    }
}