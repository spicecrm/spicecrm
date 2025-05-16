/**
 * @module SystemComponents
 */
import {
    Component, ComponentRef,
    EventEmitter,
    Inject,
    Injector,
    Optional, ViewChild,
} from '@angular/core';
import {language} from '../../services/language.service';
import {DomSanitizer} from '@angular/platform-browser';
import { model } from '../../services/model.service';
import { take } from 'rxjs/operators';
import { modal } from '../../services/modal.service';
import { DOCUMENT } from '@angular/common';
import {SystemSourceEditor} from "./systemsourceeditor";

@Component({
    selector: "system-richtext-sourcemodal",
    templateUrl: "../templates/systemrichtextsourcemodal.html",
})
export class SystemRichTextSourceModal {
    /**
     * reference to the source code editor
     * @private
     */
    @ViewChild(SystemSourceEditor) private systemSourceEditor: SystemSourceEditor;
    /**
     * reference to this component
     */
    public self: ComponentRef<this>;
    /**
     * source code to edit
     */
    public sourceCode: string = '';
    /**
     * source code language
     * @default html
     */
    public codeLanguage: 'html' | 'javascript' | 'php' | 'css' | 'json' | 'typescript' | 'mysql' | string = 'html';
    /**
     * change code emitter
     */
    public sourceCode$: EventEmitter<string> = new EventEmitter<string>();
    /**
     * the split showing both or just one of the windows
     */
    public splitMode: 'left'|'split'|'right' = 'split';
    /**
     * show/hide preview container
     */
    private _showPreview: boolean = true;

    constructor(
        public language: language,
        public sanitized: DomSanitizer,
        public injector: Injector,
        @Optional() public model: model,
        public modal: modal,
        @Inject(DOCUMENT) public _document: any ) {
    }

    /**
     * set show preview flag
     * @param show
     */
    set showPreview(show: boolean) {
        this._showPreview = show;
        this.splitMode = !show ? 'right' : 'split';
    }

    /**
     * @return show preview flag
     */
    get showPreview(): boolean {
        return this._showPreview;
    }

    /**
     * @return sanitized source code
     */
    get sanitizedCode() {
        return this.sanitized.bypassSecurityTrustHtml(this.sourceCode);
    }

    /**
     * close the modal and emit the html
     */
    public close() {
        this.sourceCode$.emit(this.sourceCode);
        this.sourceCode$.complete();
        this.self.destroy();
    }

    /**
     * Should the TemplateVariableHelper be offered, the button enabled?
     */
    public get useTemplateVariableHelper() {
        return ( this.model?.module === 'OutputTemplates' || this.model?.module === 'EmailTemplates' || this.model?.module === 'CampaignTasks' );
    }

    /**
     * Open the modal with the TemplateVariableHelper
     */
    public openTemplateVariableHelper() {
        this.modal.openModal('OutputTemplatesVariableHelper', false, this.injector)
            .pipe(take(1))
            .subscribe(modal => {
                modal.instance.response
                    .pipe(take(1))
                    .subscribe( text => {
                        const position = this.systemSourceEditor.editor.getCursorPosition();
                        this.systemSourceEditor.editor.session.insert(position, `{${text}}`);
                    });
            });
    }

    /**
     * close the modal
     */
    public onModalEscX() {
        this.close();
    }

    /**
     * format html
     */
    public beautify() {
        this.systemSourceEditor.beautify();
    }

    /**
     * undo changes
     */
    public undo() {
        this.systemSourceEditor.editor.undo();
    }

    /**
     * redo changes
     */
    public redo() {
        this.systemSourceEditor.editor.redo();
    }

    /**
     * toggle show whitespaces
     */
    public toggleShowWhitespaces() {
        this.systemSourceEditor.toggleShowWhitespaces();
    }
}
