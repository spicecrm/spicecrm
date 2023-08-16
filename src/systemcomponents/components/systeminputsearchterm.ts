/**
 * @module WorkbenchModule
 */
import {Component, EventEmitter, forwardRef, Input, Output} from '@angular/core';
import {configurationService} from '../../services/configuration.service';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {fromEvent} from "rxjs";
import {take} from "rxjs/operators";
import {fts} from "../../services/fts.service";

@Component({
    selector: 'system-input-search-term',
    templateUrl: '../templates/systeminputsearchterm.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemInputSearchTerm),
            multi: true
        }
    ]
})
export class SystemInputSearchTerm implements ControlValueAccessor {
    /**
     * holds the search timeout id
     */
    public searchTimeoutId: number;
    /**
     * indicates if the entered search terms would provoke any error
     * dues to the min ngram restrictions and thus would certainly not find any results
     */
    public searchTermErrors: { label: string, nestedValues: string[] }[];
    /**
     * show error boolean
     */
    public showError: boolean = false;

    @Input() public placeholder: string = "LBL_SEARCH";

    @Input() public timeoutSeconds: number = 1000;

    /**
     * emit when search term button clicked
     */
    @Output() public onSearchTermClear = new EventEmitter<void>();
    /**
     * emit when the input focused or blurred
     */
    @Output() public onFocusChange = new EventEmitter<boolean>();
    /**
     * emit when key enter pressed
     */
    @Output() public onEnterPress = new EventEmitter<void>();
    /**
     * emit ngModel value
     */
    public onChange: (value: string) => void;
    public onTouched: () => void;

    constructor(public fts: fts,
                public configuration: configurationService) {
    }

    public _searchTerm: string;

    get searchTerm() {
        return this._searchTerm;
    }

    /**
     * set and emit the search term
     * @param value
     */
    set searchTerm(value) {
        this._searchTerm = value;
        window.clearTimeout(this.searchTimeoutId);

        const errors = !value ? undefined : this.fts.checkForSearchTermErrors(value);

        if (!errors) {
            this.searchTermErrors = undefined;
            this.showError = false;
            this.searchTimeoutId = window.setTimeout(() => this.onChange(value), this.timeoutSeconds);
        } else {
            this.searchTermErrors = errors;
        }

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
        this._searchTerm = value;
    }

    /**
     * clear the search term
     */
    public clearSearchTerm() {
        // cancel any ongoing search
        if (this.searchTimeoutId) window.clearTimeout(this.searchTimeoutId);

        // clear the search term
        this._searchTerm = '';
        this.onSearchTermClear.emit();
    }

    /**
     * toggle show error
     * @param container
     */
    public toggleShowError(container: HTMLElement) {

        this.showError = !this.showError;

        if (!this.showError) return;

        this.handleDocumentClick(container);
    }

    /**
     * handle document click to close the error dialog
     * @param container
     */
    public handleDocumentClick(container: HTMLElement) {

        fromEvent(window, 'mousedown').pipe(take(1)).subscribe(e => {
            if (container.contains(e.target as HTMLElement)) {
                this.handleDocumentClick(container);
            } else {
                this.showError = false;
            }
        });
    }
}
