/**
 * @module SystemComponents
 */
import {Component, EventEmitter, Input, OnInit} from "@angular/core";
import {language} from "../../services/language.service";

declare var _: any;

@Component({
    selector: "system-language-selector",
    templateUrl: "../templates/systemlanguageselector.html"
})
export class SystemLanguageSelector implements OnInit{

    /**
     * unique id to match the label
     */
    public compId: string;

    /**
     * the available languages
     */
    public availableLanguages: any[] = [];

    /**
     * emitter for changes on teh language
     */
    public selected: EventEmitter<boolean> = new EventEmitter();

    /**
     * set to false if no label shoudl be displayed
     */
    @Input() public displaylabel: boolean = true;

    constructor(public language: language) {
        this.compId = _.uniqueId();
    }

    public ngOnInit(): void {
        this.getAvialableLanguages();
    }

    /**
     * returns the avialable languages
     */
    public getAvialableLanguages() {
        this.availableLanguages = this.language.getAvialableLanguages(true);
    }

    /**
     * returns the current language
     */
    get currentlanguage() {
        return this.language.currentlanguage;
    }

    /**
     * sets the current language and triggers the reload
     * @param value
     */
    set currentlanguage(value) {
        this.language.currentlanguage = value;
        this.language.loadLanguage();
        this.selected.emit(true);
    }

}
