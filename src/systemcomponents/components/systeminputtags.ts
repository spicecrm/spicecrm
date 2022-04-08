/**
 * @module SystemComponents
 */

// from https://github.com/kolkov/angular-editor
import {
    Component, ElementRef,
    Output,
    EventEmitter,
    OnDestroy,
    Renderer2,
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

import {language} from "../../services/language.service";
import {userpreferences} from "../../services/userpreferences.service";
import {backend} from "../../services/backend.service";

/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: "system-input-tags",
    templateUrl: "../templates/systeminputtags.html"
})
export class SystemInputTags {

    @Output() public tagemitter: EventEmitter<string> = new EventEmitter<string>();

    // for the dropdown
    public querystring: string = '';
    public querytimeout: any = undefined;
    public matchedtags: string[] = [];
    public matchedtagindex: number;

    constructor(public elementref: ElementRef,
                public renderer: Renderer2,
                public userpreferences: userpreferences,
                public backend: backend,
                public language: language) {
    }

    get isOpen(): boolean {
        return this.matchedtags.length > 0;
    }


    public search(_e) {
        // handle the key pressed
        switch (_e.key) {
            case 'ArrowDown':
            case 'ArrowUp':
                break;
            case ',':
            case ';':
            case 'Enter':
                this.addTag(this.querystring.replace(/^[\s]+|[\s\W]+$/gm, ''))
                break;
            default:
                if (this.querytimeout) window.clearTimeout(this.querytimeout);
                this.querytimeout = window.setTimeout(() => this.doSearch(), 500);
                break;
        }
    }

    public doSearch() {
        /*
        this.backend.getRequest('SpiceTags/' + btoa(this.querystring.trim())).subscribe(tags => {
            this.matchedtags = tags;
            this.matchedtags.sort((a, b) => {
                return a.toLowerCase() > b.toLowerCase() ? 1 : -1;
            });
        });
        */
        this.backend.postRequest('common/spicetags', {},  {search: this.querystring.trim()}).subscribe(tags => {
            this.matchedtags = tags;
            this.matchedtags.sort((a, b) => {
                return a.toLowerCase() > b.toLowerCase() ? 1 : -1;
            });
        });
    }

    public addTag(tag){
        if (this.querytimeout) window.clearTimeout(this.querytimeout);
        this.matchedtags = [];

        // emit the value
        this.tagemitter.emit(tag);

        // reset the fieldvalue
        this.querystring = '';
    }


}
