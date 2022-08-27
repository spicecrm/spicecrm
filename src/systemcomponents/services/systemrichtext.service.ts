/**
 * @module SystemComponents
 */
// from https://github.com/kolkov/angular-editor
import {
    AfterContentInit,
    Component, ElementRef,
    EventEmitter,
    forwardRef,
    Inject,
    Input,
    OnInit,
    Output,
    Renderer2,
    ViewChild
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {metadata} from "../../services/metadata.service";
import {DOCUMENT} from "@angular/common";


import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent} from "@angular/common/http";
import {HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import { backend } from '../../services/backend.service';

/**
 * @ignore
 */
declare var _: any;

export interface CustomClass {
    name: string;
    class: string;
    tag?: string;
}



export interface UploadResponse {
    imageUrl: string;
}

@Injectable()
export class systemrichtextservice {
    public savedSelection: Range | null;
    public selectedText: string;
    public selectedHtml: string;
    public uploadUrl: string;

    /**
     * to help encoding/decoding html
     */
    public dummyHtmlElement: HTMLElement;

    public editorContainer: HTMLElement;

    public savedSelectionParentElement: HTMLElement;

    constructor(@Inject(DOCUMENT) public _document: Document, public backend: backend ) {
        this.dummyHtmlElement = document.createElement('div');
    }

    /**
     * Executed command from editor header buttons exclude toggleEditorMode
     * @param command string from triggerCommand
     */
    public executeCommand(command: string) {
        if (command === 'h1' || command === 'h2' || command === 'h3' || command === 'h4' || command === 'h5' || command === 'h6' || command === 'p' || command === 'pre' || command === 'div') {
            this._document.execCommand('formatBlock', false, command);
        }

        this._document.execCommand(command, false, null);
        return;
    }

    /**
     * Create URL link
     * @param url string from UI prompt
     * @param text string from UI prompt
     * @param attributes object with html attributes
     */
    /*
    public createLink( url: string, text: string, attributes: {} = {} )
    {
        if ( !text ) text = url;
        let blankTarget = !url.includes('http');
        let attributesString = '';
        for( const prop in attributes ) {
            attributesString += ( ' ' + prop + '="'+this.encodeHTMLEntities( attributes[prop] ) + '"' );
        }
        const html = '<a href="' + url + '"' + ( blankTarget ? ' target="_blank"':'' ) + attributesString + '>' + text + '</a>';
        this.insertHtml(html);
    }
     */

    /**
     * insert color either font or background
     *
     * @param color color to be inserted
     * @param where where the color has to be inserted either text/background
     */
    public insertColor(color: string, where: string): void {
        const restored = this.restoreSelection();
        if (restored) {
            if (where === 'textColor') {
                this._document.execCommand('foreColor', false, color);
            } else {
                this._document.execCommand('hiliteColor', false, color);
            }
        }

        return;
    }

    /**
     * Set font name
     * @param fontName string
     */
    public setFontName(fontName: string) {
        this._document.execCommand("fontName", false, fontName);
    }

    /**
     * Set font size
     * @param fontSize string
     */
    public setFontSize(fontSize: string) {
        this._document.execCommand("fontSize", false, fontSize);
    }

    /**
     * Create raw HTML
     * @param html HTML string
     */
    public insertHtml(html: string): void {

        const isHTMLInserted = this._document.execCommand('insertHTML', false, html);

        if (!isHTMLInserted) {
            throw new Error('Unable to perform the operation');
        }

        return;
    }

    /**
     * save selection when the editor is focussed out
     */
    public saveSelection(): any {
        if (window.getSelection) {
            const sel = window.getSelection();
            this.savedSelectionParentElement = sel.anchorNode.parentElement;
            if (sel.getRangeAt && sel.rangeCount) {
                this.savedSelection = sel.getRangeAt(0);
                this.selectedText = sel.toString();
                // Get HTML of saved selection:
                let dummyDiv = document.createElement('div');
                dummyDiv.appendChild( this.savedSelection.cloneContents() );
                this.selectedHtml = dummyDiv.innerHTML;
            }
        } else if (this._document.getSelection && this._document.createRange) {
            this.savedSelection = document.createRange();
        } else {
            this.savedSelection = null;
        }
    }

    /**
     * restore selection when the editor is focussed in
     *
     * saved selection when the editor is focussed out
     */
    public restoreSelection(): boolean {
        if (this.savedSelection) {
            if (window.getSelection) {
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(this.savedSelection);
                return true;
            } else if (this._document.getSelection /*&& this.savedSelection.select*/) {
                // this.savedSelection.select();
                return true;
            }
        } else {
            return false;
        }
    }

    /** check any slection is made or not */
    public checkSelection(): any {

        const slectedText = this.savedSelection.toString();

        if (slectedText.length === 0) {
            throw new Error('No Selection Made');
        }

        return true;
    }

    /**
     * Insert image with Url
     * @param imageUrl
     * @param editorContainer
     */
    public insertImage(imageUrl: string, editorContainer: HTMLElement) {

        const newImg: HTMLImageElement = document.createElement('IMG') as HTMLImageElement;
        newImg.src = imageUrl;
        this.insertElement(newImg);
    }

    /**
     * Inserts an anchor (link) to html text.
     * @param href
     * @param editorContainer
     * @param content
     * @param dataAttributes
     */
    public insertAnchor( href: string, content: string, dataAttributes: any = {} ) {
        const newAnchor: HTMLAnchorElement = document.createElement('A') as HTMLAnchorElement;
        newAnchor.href = href;
        this.addDataAttributes( newAnchor, dataAttributes );
        newAnchor.innerHTML = content;
        this.insertElement( newAnchor );
    }

    /**
     * Adds data-* attributes to a HTML element.
     * @param htmlElement
     * @param data Object with the attributs
     */
    public addDataAttributes( htmlElement: HTMLElement, data: any ) {
        for ( let key in data ) {
            htmlElement.dataset[key] = data[key];
        }
    }

    /**
     * handle inserting a new element as a child of the selection or append to the content if there is no selection
     * @param element
     * @param editorContainer
     */
    public insertElement(element: HTMLElement) {

        if (!this.savedSelection) {

            this.insertElementForNode(element, this.editorContainer);

        } else {

            this.resetRangeBoundaries(this.editorContainer);

            let currentTarget = this.getRangeCurrentTarget(this.savedSelection.startContainer, this.editorContainer);
            const addBefore = this.savedSelection.collapsed && this.savedSelection.startOffset == 0;
            const currentTargetIsEditor = this.editorContainer.isEqualNode(currentTarget);
            let beforeElement;

            if (currentTargetIsEditor) {
                beforeElement = !addBefore ? null : this.editorContainer.firstChild as HTMLElement;
                this.insertElementForNode(element, this.editorContainer, beforeElement);
            } else {
                beforeElement = !addBefore ? currentTarget.nextSibling : currentTarget;
                this.insertElementForNode(element, currentTarget.parentElement, beforeElement);
            }

            this.clearSelection();
        }
    }

    /**
     * clear the document/window user selection
     * @private
     */
    public clearSelection() {

        this.savedSelection = undefined;

        if (window.getSelection) {
            window.getSelection().removeAllRanges();
        } else if (document.getSelection) {
            document.getSelection().removeAllRanges();
        }
    }

    /**
     * reset the range start container boundaries if selection is out of the editor range
     * @param editorContainer
     * @protected
     */
    public resetRangeBoundaries(editorContainer) {
        if (!this.savedSelection) return;
        if (!editorContainer.contains(this.savedSelection.startContainer)) {
            this.savedSelection.setStart(editorContainer, 0);
        }
        if (!editorContainer.contains(this.savedSelection.endContainer)) {
            this.savedSelection.setEnd(editorContainer, 0);
        }
    }

    /**
     * insert an element for the given parent element
     * @param element
     * @param target
     * @param beforeElement
     * @protected
     */
    public insertElementForNode(element: HTMLElement, target: HTMLElement, beforeElement?: HTMLElement) {

        if (this.savedSelection) {
            this.savedSelection.deleteContents();
        }

        if (!beforeElement) {
            target.appendChild(element);
        } else {
            target.insertBefore(element, beforeElement);
        }
    }

    /**
     * get the current target for a range by returning the parent node of the start container on the editor first level
     * @param startContainer
     * @param editorContainer
     * @protected
     */
    public getRangeCurrentTarget(startContainer: Node, editorContainer: HTMLElement): HTMLElement {

        let currentTarget = startContainer as HTMLElement;

        if (!editorContainer.isEqualNode(currentTarget)) {

            while (currentTarget.nodeType !== 1) {
                currentTarget = currentTarget.parentElement;
            }
            return currentTarget;
        } else {
            return editorContainer;
        }
    }

    public createCustomClass(customClass: CustomClass) {
        const tagName = customClass.tag ? customClass.tag : 'span';
        const newTag = '<' + tagName + ' class="' + customClass.class + '">' + this.selectedText + '</' + tagName + '>';
        this.insertHtml(newTag);
    }

    public decodeHTMLEntities(text) {
        this.dummyHtmlElement.innerHTML = text;
        return this.dummyHtmlElement.innerText;
    }

    public encodeHTMLEntities(text) {
        this.dummyHtmlElement.innerText = text;
        return this.dummyHtmlElement.innerHTML;
    }

    public marketingActions: {id: string, name: string}[] = null;

    public loadMarketingActions( force = false ) {
        if ( force || !_.isArray( this.marketingActions )) {
            this.backend.getRequest( 'module/MarketingActions/all/actions' ).subscribe(
                response => {
                    this.marketingActions = response.actions;
                }
            )
        }
    }

}
