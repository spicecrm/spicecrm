// from https://github.com/kolkov/angular-editor
import {
    AfterContentInit,
    Component, ElementRef,
    EventEmitter,
    forwardRef,
    Inject,
    Input,
    OnInit,
    OnDestroy,
    Output,
    Renderer2,
    ViewChild
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {metadata} from "../../services/metadata.service";
import {modelutilities} from "../../services/modelutilities.service";
import {DOCUMENT} from "@angular/common";

import {systemrichtextservice} from "../services/systemrichtext.service";

@Component({
    selector: "system-richtext-editor",
    templateUrl: "./src/systemcomponents/templates/systemrichtexteditor.html",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemRichTextEditor),
            multi: true
        }, systemrichtextservice
    ]
})
export class SystemRichTextEditor implements OnInit, OnDestroy, ControlValueAccessor {

    private onChange: (value: string) => void;
    private onTouched: () => void;

    private editable: boolean = true;

    private modeVisual = true;

    private id: string = '';
    private isActive: boolean = false;
    private clickListener: any;

    @ViewChild('editor') private textArea: any;
    @ViewChild('editorWrapper') private editorWrapper: any;
    @ViewChild('editorToolbar') private editorToolbar: any;

    @Output() private viewMode = new EventEmitter<boolean>();

    /** emits `blur` event when focused out from the textarea */
    @Output() private blur: EventEmitter<string> = new EventEmitter<string>();

    /** emits `focus` event when focused in to the textarea */
    @Output() private focus: EventEmitter<string> = new EventEmitter<string>();

    constructor(private modelutilities: modelutilities, private renderer: Renderer2, private editorService: systemrichtextservice, @Inject(DOCUMENT) private _document: any, private elementRef: ElementRef, ) {
        this.id = this.modelutilities.generateGuid();
    }

    public ngOnInit() {
        this.editorToolbar.id = this.id;
    }

    public ngOnDestroy() {
        this.clickListener();
    }

    /**
     * Executed command from editor header buttons
     * @param command string from triggerCommand
     */
    private executeCommand(command: string) {
        if (command === 'toggleEditorMode') {
            this.toggleEditorMode(this.modeVisual);
        } else if (command !== '') {
            this.editorService.executeCommand(command);
            this.exec();
        }
        return;
    }

    /**
     * focus event
     */
    private onTextAreaFocus(): void {
        this.focus.emit('focus');
        return;
    }

    /**
     * blur event
     */
    private onTextAreaBlur() {
        /**
         * save selection if focussed out
         */
        this.editorService.saveSelection();

        if (typeof this.onTouched === 'function') {
            this.onTouched();
        }
        this.blur.emit('blur');
        return;
    }

    /**
     *  focus the text area when the editor is focussed
     */
    private onEditorClick() {
        // check if we are active already
        if(!this.isActive) {
            this.textArea.nativeElement.focus();
            this.isActive = true;

            // listen to the click event if it is ousoide of the current elements scope
            this.clickListener = this.renderer.listen('document', 'click', (event) => this.onClick(event));
        }
    }

    public onClick(event: MouseEvent) {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.isActive = false;
            this.clickListener();
        }
    }

    /**
     * Executed from the contenteditable section while the input property changes
     * @param html html string from contenteditable
     */
    private onContentChange(html: string): void {

        if (typeof this.onChange === 'function') {
            this.onChange(html);
        }
        return;
    }

    /**
     * Set the function to be called
     * when the control receives a change event.
     *
     * @param fn a function
     */
    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    /**
     * Set the function to be called
     * when the control receives a touch event.
     *
     * @param fn a function
     */
    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    /**
     * Write a new value to the element.
     *
     * @param value value to be executed when there is a change in contenteditable
     */
    public writeValue(value: any): void {


        if (value === null || value === undefined || value === '' || value === '<br>') {
            value = null;
        }

        this.refreshView(value);
    }

    /**
     * refresh view/HTML of the editor
     *
     * @param value html string from the editor
     */
    private refreshView(value: string): void {
        const normalizedValue = value === null ? '' : value;
        this.renderer.setProperty(this.textArea.nativeElement, 'innerHTML', normalizedValue);
        return;
    }

    /**
     * Implements disabled state for this element
     *
     * @param isDisabled
     */
    public setDisabledState(isDisabled: boolean): void {
        const div = this.textArea.nativeElement;
        // const action = isDisabled ? 'addClass' : 'removeClass';
        // this._renderer[action](div, 'disabled');
    }

    /**
     * toggles editor mode based on bToSource bool
     *
     * @param bToSource A boolean value from the editor
     */
    private toggleEditorMode(bToSource: boolean) {
        let oContent: any;
        const editableElement = this.textArea.nativeElement;

        if (bToSource) {
            oContent = this._document.createTextNode(editableElement.innerHTML);
            editableElement.innerHTML = '';

            const oPre = this._document.createElement('pre');
            oPre.setAttribute("style", "margin: 0; outline: none;");
            const oCode = this._document.createElement('code');
            editableElement.contentEditable = false;
            oCode.id = "sourceText";
            oCode.setAttribute("style", "white-space: pre-wrap; word-break: keep-all; margin: 0; outline: none; background-color: #fff5b9;");
            oCode.contentEditable = 'true';
            oCode.appendChild(oContent);
            oPre.appendChild(oCode);
            editableElement.appendChild(oPre);

            this._document.execCommand("defaultParagraphSeparator", false, "div");

            this.modeVisual = false;
            this.viewMode.emit(false);
            oCode.focus();
        } else {
            if (this._document.all) {
                editableElement.innerHTML = editableElement.innerText;
            } else {
                oContent = this._document.createRange();
                oContent.selectNodeContents(editableElement.firstChild);
                editableElement.innerHTML = oContent.toString();
            }
            editableElement.contentEditable = true;
            this.modeVisual = true;
            this.viewMode.emit(true);
            this.onContentChange(editableElement.innerHTML);
            editableElement.focus();
        }
        this.editorToolbar.setEditorMode(!this.modeVisual);
    }

    /**
     * toggles editor buttons when cursor moved or positioning
     *
     * Send a node array from the contentEditable of the editor
     */
    private exec() {

        let userSelection;
        if (window.getSelection) {
            userSelection = window.getSelection();
        }

        let a = userSelection.focusNode;
        const els = [];
        while (a && a.id !== 'editor') {
            els.unshift(a);
            a = a.parentNode;
        }
        this.editorToolbar.triggerBlocks(els);
    }
}
