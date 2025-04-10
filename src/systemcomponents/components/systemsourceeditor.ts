import {Component, forwardRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import Ace from 'ace-builds';
import {asapScheduler} from "rxjs";
import {libloader} from "../../services/libloader.service";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {SystemRichTextSourceModal} from "./systemrichtextsourcemodal";
import {modal} from "../../services/modal.service";

@Component({
    selector: 'system-source-editor',
    templateUrl: '../templates/systemsourceeditor.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SystemSourceEditor),
        multi: true
    }],
    host: {
        class: 'spice-display-block'
    }
})

export class SystemSourceEditor implements OnInit, OnDestroy, ControlValueAccessor {
    /**
     * dom reference to the source editor container
     */
    @ViewChild('sourceEditor', {static: true}) public sourceEditor: any;
    /**
     * holds the programming language to be selected in the editor
     * @default html
     * @private
     */
    @Input() private language: 'html' | 'javascript' | 'php' | 'css' | 'json' | 'typescript' | 'mysql' | string = 'html';
    /**
     * show/hide the toolbar
     */
    @Input() public showToolbar: boolean = true;
    /**
     * enable/disable formatting the code
     * @private
     */
    @Input() private autoFormat: boolean = true;
    /**
     * flag to show the open in modal button
     */
    @Input() public canOpenInModal: boolean = true;
    /**
     * holds ace editor instance
     */
    public editor: Ace.Editor;
    /**
     * holds the source code
     * @private
     */
    private sourceCode: string;
    /**
     * holds the value change handler
     * @private
     */
    private changeHandler: (delta: Ace.Ace.Delta) => void;
    /**
     * save on change function for ControlValueAccessor
     */
    public onChange: (modelValue: any) => void;
    /**
     * necessary for ngModel
     */
    public registerOnTouched = () => {};

    constructor(private libLoader: libloader,
                private modal: modal) {
    }

    public ngOnInit() {

        Ace.config.set('basePath', './vendor/ace-editor');

        const extensions = [
            './vendor/ace-editor/ext-language_tools.js',
            './vendor/ace-editor/ext-beautify.js',
        ];

        // load necessary extensions before initializing the editor
        this.libLoader.loadFromSource(extensions).subscribe(() => {

            this.editor = Ace.edit(this.sourceEditor.nativeElement,
                {
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true,
                    value: this.sourceCode,
                    mode: 'ace/mode/' + this.language
                }
            );

            if (this.autoFormat) {
                asapScheduler.schedule(() => this.beautify(), 500);
            }

            this.changeHandler = this.editor.session.on('change', () => {
                this.sourceCode = this.editor.getValue();
                this.onChange(this.sourceCode);
            });
        });
    }

    /**
     * destroy editor
     */
    public ngOnDestroy() {

        if (this.changeHandler) {
            this.editor.session.off('change', this.changeHandler);
        }

        this.editor.destroy();
        this.editor.container.remove();
    }

    /**
     * open the editor in a modal
     */
    public openInModal(showPreview: boolean = false) {
        this.modal.openStaticModal(SystemRichTextSourceModal, true)
            .subscribe(componentRef => {
                componentRef.instance.sourceCode = this.sourceCode;
                componentRef.instance.codeLanguage = this.language;
                componentRef.instance.showPreview = showPreview;
                componentRef.instance.sourceCode$.subscribe(sourceCode => {
                    this.sourceCode = sourceCode;
                    this.editor.setValue(sourceCode);
                });
            });
    }

    /**
     * format html
     */
    public beautify() {
        Ace.require('ace/ext/beautify').beautify(this.editor.session);
    }

    /**
     * register the ngModel change emit value
     * @param fn
     */
    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    /**
     * write the incoming value
     * @param code
     */
    public writeValue(code: string): void {
        this.sourceCode = code;
    }

    /**
     * undo changes
     */
    public undo() {
        this.editor.undo();
    }

    /**
     * redo changes
     */
    public redo() {
        this.editor.redo();
    }

    /**
     * toggle show whitespaces
     */
    public toggleShowWhitespaces() {
        this.editor.setOptions({
            showInvisibles: !this.editor.getOption('showInvisibles'),
        });
    }
}