// from https://github.com/kolkov/angular-editor
import {
    AfterContentInit,
    Component,
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

import {systemrichtextservice} from "../services/systemrichtext.service";


export interface CustomClass {
    name: string;
    class: string;
    tag?: string;
}


@Component({
    selector: "system-richtext-toolbar",
    templateUrl: "./src/systemcomponents/templates/systemrichtexttoolbar.html",
})

export class SystemRichTextToolbar {

    @Input() private isActive: boolean = false;

    private id = '';
    private htmlMode = false;
    private showToolbar = true;

    private block = 'default';
    private fontName = 'Tilium Web';
    private fontSize = '5';

    private customClassId = -1;
    private customClasses: CustomClass[];

    private tagMap = {
        BLOCKQUOTE: "indent",
        A: "link"
    };

    private select = ["H1", "H2", "H3", "H4", "H5", "H6", "P", "PRE", "DIV"];

    @Output() private execute: EventEmitter<string> = new EventEmitter<string>();

    constructor(private _renderer: Renderer2,
                private editorService: systemrichtextservice, @Inject(DOCUMENT) private _document: any) {
    }

    /**
     * Trigger command from editor header buttons
     * @param command string from toolbar buttons
     */
    private triggerCommand(command: string) {
        this.execute.emit(command);
        return;
    }

    private commandIsActive(commandState) {
        // if not is active always show false
        if(!this.isActive || this.htmlMode) {
            return false;
        }

        // check the state
        return this._document.queryCommandState(commandState);
    }

    /**
     * trigger highlight editor buttons when cursor moved or positioning in block
     */
    private triggerBlocks(nodes: Node[]) {
        if (!this.showToolbar) {
            return;
        }
        let found = false;
        this.select.forEach(y => {
            const node = nodes.find(x => x.nodeName === y);
            if (node !== undefined && y === node.nodeName) {
                if (found === false) {
                    this.block = node.nodeName.toLowerCase();
                    found = true;
                }
            } else if (found === false) {
                this.block = 'default';
            }
        });

        found = false;
        if (this.customClasses) {
            this.customClasses.forEach((y, index) => {
                const node = nodes.find(x => {
                    if (x instanceof Element) {
                        return x.className === y.class;
                    }
                });
                if (node !== undefined) {
                    if (found === false) {
                        this.customClassId = index;
                        found = true;
                    }
                } else if (found === false) {
                    this.customClassId = -1;
                }
            });
        }

        /*
        Object.keys(this.tagMap).map(e => {
            const elementById = this._document.getElementById(this.tagMap[e] + '-' + this.id);
            const node = nodes.find(x => x.nodeName === e);
            if (node !== undefined && e === node.nodeName) {
                this._renderer.addClass(elementById, "active");
            } else {
                this._renderer.removeClass(elementById, "active");
            }
        });
        */
    }

    /**
     * insert URL link
     */
    private insertUrl() {
        const url = prompt("Insert URL link", 'http:\/\/');
        if (url && url !== '' && url !== 'http://') {
            this.editorService.createLink(url);
        }
    }

    /** insert color */
    private insertColor(color: string, where: string) {
        this.editorService.insertColor(color, where);
        this.execute.emit("");
    }

    /**
     * set font Name/family
     * @param fontName string
     */
    private setFontName(fontName: string): void {
        this.editorService.setFontName(fontName);
        this.execute.emit("");
    }

    /**
     * set font Size
     * @param fontSize string
     *  */
    private setFontSize(fontSize: string): void {
        this.editorService.setFontSize(fontSize);
        this.execute.emit("");
    }

    /**
     * toggle editor mode (WYSIWYG or SOURCE)
     * @param m boolean
     */
    private setEditorMode(m: boolean) {
        const toggleEditorModeButton = this._document.getElementById("toggleEditorMode" + '-' + this.id);
        this.htmlMode = m;
    }

    /**
     * Upload image when file is selected
     */
    private onFileChanged(event) {

    }

    private setCustomClass(classId: number) {
        this.editorService.createCustomClass(this.customClasses[classId]);
    }
}
