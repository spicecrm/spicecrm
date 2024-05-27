/**
 * @module SystemComponents
 */
import {
    AfterContentInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component, ContentChildren,
    ElementRef,
    forwardRef,
    Input, QueryList,
    Renderer2,
    SimpleChanges,
    ViewChild,
    ViewContainerRef
} from "@angular/core";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {SystemDropdownTriggerDirective} from "../../directives/directives/systemdropdowntrigger";
import {SystemSelectOption} from "./systemselectoption";
import {SystemSelectNgModelValue, SystemSelectOptionI} from "../interfaces/systemcomponents.interfaces";

/**
 * @ignore
 */
declare var _;

@Component({
    selector: "system-select",
    templateUrl: "../templates/systemselect.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SystemSelect),
        multi: true
    }]
})
export class SystemSelect implements ControlValueAccessor, AfterContentInit {
    /**
     * reference to the dropdown trigger directive
     * @private
     */
    @ViewChild(SystemDropdownTriggerDirective) private dropdownTrigger: SystemDropdownTriggerDirective;
    /**
     * when true emit and receive the id as ngModel value
     */
    @Input('system-select-id-only') set setIdOnly(value) {
        if (value === false) {
            this.idOnly = false;
        } else {
            this.idOnly = true;
        }
    }
    @Input() public idOnly: boolean = false;
    /**
     * label of the form element
     */
    @Input() public label: string = "";
    /**
     * holds the input value
     */
    public value: string;
    /**
     * holds the defined list height by slds style
     */
    @Input() public listHeight: '10' | '7' | '5' = '7';
    /**
     * holds the disabled boolean
     */
    @Input() public disabled: boolean = false;
    /**
     * emit the input value on enter press
     */
    @Input() public emitInputValueOnEnterPress: boolean = false;
    /**
     * holds the search list results
     */
    public searchList: SystemSelectOptionI[] = [];
    /**
     * holds a boolean to show/hide the results list
     */
    public searchListIsVisible: boolean = false;
    /**
     * holds the focused dom item data
     */
    public focusedItemId: string;
    /**
     * change emitter by ngModel
     * @private
     */
    public onChange: (value: SystemSelectNgModelValue | string) => void;
    /**
     * reference to the result list ul element
     * @private
     */
    @ViewChild('resultList', {read: ViewContainerRef}) public resultListContainer: ViewContainerRef;
    /**
     * true if the focus in the input
     */
    public inputIsVisible: boolean = false;

    @ContentChildren(SystemSelectOption) private options: QueryList<SystemSelectOption>;

    constructor(public elementRef: ElementRef,
                public cdRef: ChangeDetectorRef,
                public renderer: Renderer2) {
    }

    /**
     * @return string dropdown length style
     */
    get dropdownLength() {
        return `calc(((1rem * 1.5) + 1rem) * ${this.listHeight})`;
    }

    public ngAfterContentInit() {
        this.searchList = this.generateSearchList();
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
        return;
    }

    /**
     * Write a new value to the element.
     * @param value
     */
    public writeValue(value: string | SystemSelectNgModelValue) {

        if (!value) return;

        if(typeof value == 'string') {
            value = this.searchList.find(e => e.id == value);
        }
        this.value = value.name;
        this.focusedItemId = value.id;

        this.cdRef.detectChanges();
    }

    /**
     * emit the value by ngModelChange
     * @param option
     */
    public emitValue(option: SystemSelectOptionI) {

        if (this.idOnly) {
            this.onChange(option?.id);
        } else {
            this.onChange({id: option.id, name: option.name, group: option.group});
        }
    }

    /**
     * handle the click outside the search box
     * @param event
     */
    public outsideClickHandler(event: MouseEvent): void {

        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.setSearchListVisible(false);
        }
    }

    /**
     * handle the key up
     * @param event
     */
    public onKeyup(event: KeyboardEvent) {

        switch (event.key) {
            case 'ArrowUp':
            case 'ArrowDown':
                return this.navigateThroughResultList(event);
            case 'Enter':
                this.handleEnterPress();
                break;
            case 'Escape':
                event.stopPropagation();
                this.setSearchListVisible(false);
                break;
            default:
                if (!this.value) {
                    this.onChange(undefined);
                }
                this.filterSearchList();
                break;
        }

        if (this.searchList.length == 0 || event.key == 'Enter') {

            this.setSearchListVisible(false);
        }

        this.cdRef.detectChanges();
    }

    /**
     * handle input focus and show the search list
     */
    public onFocus() {

        this.setSearchListVisible(true);
        this.inputIsVisible = true;
    }

    /**
     * handle input blur the hide the result list
     */
    public onBlur(event: FocusEvent) {
        this.inputIsVisible = false;
        this.setSearchListVisible(false);
    }

    /**
     * handle input click to open the list
     * @param event
     */
    public onInputClick(event: MouseEvent) {

        if (!this.searchListIsVisible) {
            this.searchList = this.generateSearchList();
        }

        this.setSearchListVisible(true);
        event.stopPropagation();
    }

    /**
     * handle result list item click
     * @param listItem
     * @param event
     * @private
     */
    public itemClicked(listItem: SystemSelectOptionI, event: MouseEvent) {

        this.setSearchListVisible(false);

        this.emitValue(listItem);
        this.value = listItem.name;
        this.focusedItemId = listItem.id;

        this.inputIsVisible = false;

        if (event.stopPropagation) event.stopPropagation();
    }

    /**
     * hide the search list and destroy the outside click listener
     */
    public setSearchListVisible(bool: boolean) {

        this.searchListIsVisible = bool && this.searchList.length > 0;

        if (!bool && this.dropdownTrigger.dropDownOpen) {
            this.dropdownTrigger.toggleDropdown();
        }

        if (bool && !this.dropdownTrigger.dropDownOpen) {
            this.dropdownTrigger.toggleDropdown();
        }
    }

    /**
     * highlight the selected list items in the dom
     * @private
     */
    public filterSearchList() {
        this.setSearchListVisible(true);
        this.focusedItemId = undefined;

        this.searchList = this.generateSearchList();

        if (!this.value || this.searchList.length == 0) return;

        this.searchList = this.searchList.filter(e => e.name.toLowerCase().indexOf(this.value.toLowerCase()) > -1);

        this.searchList.forEach(e => {

            const position = e.name.toLowerCase().indexOf(this.value.toLowerCase());

            if (position == -1) return;

            e.content = this.generateHighlightHTMLContent(e.name, position);
        });
    }

    /**
     * generate html marked match chars
     * @param text
     * @param position
     * @private
     */
    public generateHighlightHTMLContent(text: string, position: number) {
        return [text.slice(0, position), "<mark>", text.slice(position, position + this.value.length), "</mark>", text.slice(position + this.value.length)].join('');
    }

    /**
     * handle the enter key press to emit the change
     * @private
     */
    public handleEnterPress() {
        if (!!this.focusedItemId) {
            this.emitValue(
                this.searchList.find(e => e.id == this.focusedItemId)
            );
            this.inputIsVisible = false;
        } else if (this.emitInputValueOnEnterPress) {
            this.onChange(this.value);
            this.inputIsVisible = false;
        }
    }

    /**
     * generate search list
     * @return array of the search list
     * @private
     */
    public generateSearchList(): SystemSelectOptionI[] {

        const searchList = [];
        const groups = _.uniq(this.options.map(e => e.group)).sort();

        groups.forEach((g) => {

                if (!!g || (!g && groups.length > 1)) {
                    searchList.push(
                        {id: `${g}`, name: `${g}`, isGroup: true}
                    );
                }

                this.options.filter(e => e.group == g)
                    .sort((a, b) => a.display > b.display ? 1 : -1)
                    .forEach((e) =>
                        searchList.push({id: e.value, name: e.display, content: e.display, group: g})
                    );
            }
        );

        return searchList;
    }

    /**
     * navigate through the result list by arrow key press
     * @param event
     * @private
     */
    public navigateThroughResultList(event: KeyboardEvent) {

        let list = !this.searchListIsVisible ? this.generateSearchList() : this.searchList;
        list = list.filter(e => !e.isGroup);

        if (list.length == 0) {
            return;
        }

        const direction = event.key == 'ArrowDown' ? 'down' : 'up';
        const currentIndex = !this.focusedItemId ? 0 : list.findIndex(e => e.id == this.focusedItemId);
        let nextItem = direction == 'down' ? list[currentIndex + 1] : list[currentIndex - 1];

        if (!this.focusedItemId || !nextItem) {
            nextItem = list[0];
            this.focusedItemId = nextItem.id;
            this.value = nextItem.name;

        } else if (!!nextItem) {

            this.focusedItemId = nextItem.id;
            this.value = nextItem.name;
        }

        if (!this.searchListIsVisible && !!nextItem) {
            this.emitValue(nextItem);
        }

        this.scrollToFocusedSearchItem(direction);
    }

    /**
     * scroll to the focused search list item in the dom
     * @param direction
     * @private
     */
    public scrollToFocusedSearchItem(direction: 'up' | 'down') {

        if (!this.resultListContainer) return;

        const listHTMLElements: HTMLElement[] = Array.from(this.resultListContainer.element.nativeElement.children)
            .filter((e: HTMLElement) => !e.hasAttribute('data-is-group')) as HTMLElement[];

        let focusedHTMLElementIndex = listHTMLElements.findIndex((e: HTMLElement) => e.firstElementChild.classList.contains('slds-has-focus'));

        if (((focusedHTMLElementIndex + 1) == listHTMLElements.length && direction == 'down') || (focusedHTMLElementIndex == 0 && direction == 'up')) {
            focusedHTMLElementIndex = 0;
        } else {
            focusedHTMLElementIndex = direction == 'down' ? focusedHTMLElementIndex + 1 : focusedHTMLElementIndex - 1;
        }

        listHTMLElements[focusedHTMLElementIndex]?.scrollIntoView();
    }

    /**
     * clear the value
     */
    public clearValue(e: MouseEvent) {
        e.stopPropagation();
        this.value = undefined;
        this.focusedItemId = undefined;
        this.onChange(undefined);
        this.inputIsVisible = true;
    }

    /**
     * set is typing and focus the input
     */
    public setInputVisible(inputContainer: HTMLInputElement, e: MouseEvent) {
        e.stopPropagation();
        this.inputIsVisible = true;
        this.cdRef.detectChanges();
        inputContainer.focus();
    }

}
