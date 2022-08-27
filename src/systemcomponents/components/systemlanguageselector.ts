/**
 * @module SystemComponents
 */
import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {language} from "../../services/language.service";
import {modal} from "../../services/modal.service";
import {userpreferences} from "../../services/userpreferences.service";

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
     * emitter for changes on the language
     */
    @Output() public selected: EventEmitter<boolean> = new EventEmitter();

    /**
     * set to false if no label shoudl be displayed
     */
    @Input() public displaylabel: boolean = true;

    constructor(public language: language, public modal: modal, public userpreferences: userpreferences) {
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
        let loadModal = this.modal.await('LBL_LOADING');
        this.language.switchLanguage(value).subscribe({
            next: () => {
                loadModal.emit(true);
                // set in the preferences
                this.userpreferences.setPreference('language', value);
            }
        });
        this.selected.emit(true);
    }

    /**
     * reloads the current language
     */
    public reloadCurrentLanguage(){
        let loadModal = this.modal.await('LBL_LOADING');
        this.language.loadLanguage().subscribe({
            next: () => {
                loadModal.emit(true);
            }
        });
    }
}