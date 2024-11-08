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
    Input, OnChanges, OnDestroy, QueryList,
    Renderer2, SimpleChanges,
    ViewChild,
    ViewContainerRef
} from "@angular/core";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {SystemDropdownTriggerDirective} from "../../directives/directives/systemdropdowntrigger";
import {SystemSelectOption} from "./systemselectoption";
import {SystemSelectNgModelValue, SystemSelectOptionI} from "../interfaces/systemcomponents.interfaces";
import {Subscription} from "rxjs";
import {layout} from "../../services/layout.service";

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
export class SystemSelect implements ControlValueAccessor, AfterContentInit, OnDestroy {
    /**
     * reference to the dropdown trigger directive
     * @private
     */
    @ViewChild(SystemDropdownTriggerDirective) private dropdownTrigger: SystemDropdownTriggerDirective;
    /**
     * when true emit and receive the id as ngModel value
     */
    @Input('system-select-id-only') set setIdOnly(value: boolean) {
        this.idOnly = value !== false;
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
     * whether the search list should be sorted in reversed order
     * desc -> asc
     */
    @Input() public sortReversed: boolean = false;

    /**
     * holds the search list results
     */
    public searchList: SystemSelectOptionI[] = [];
    /**
     * holds the focused dom item data
     */
    public focusedItem: SystemSelectOptionI;
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

    private subscription: Subscription = new Subscription();

    constructor(public elementRef: ElementRef,
                public cdRef: ChangeDetectorRef,
                public layout: layout,
                public renderer: Renderer2) {
    }

    public ngAfterContentInit() {
        this.searchList = this.generateSearchList();
        this.subscription.add(this.options.changes.subscribe(() => {
            // rebuild the search list options on content change
            this.searchList = this.generateSearchList();
            this.cdRef.detectChanges();
        }));
    }

    public ngOnDestroy() {
        this.subscription.unsubscribe();
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
     * Write a new focusedItemOrString to the element.
     * @param focusedItemOrString
     */
    public writeValue(focusedItemOrString: string | SystemSelectNgModelValue) {

        if (!focusedItemOrString) {
            this.value = undefined
            this.inputIsVisible = true;
            return;
        }

        if(typeof focusedItemOrString == 'string') {
            const focusedItem = this.searchList.find(e => e.id == focusedItemOrString);
            if (!focusedItem) {
                this.value = focusedItemOrString;
            } else {
                this.focusedItem = focusedItem;
                this.inputIsVisible = false;
            }
        } else {
            this.focusedItem = focusedItemOrString;
            this.inputIsVisible = false;
        }

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

        // reset value and reset filter list
        this.value = undefined;
        this.filterSearchList();
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
                this.dropdownTrigger.close();
                break;
            default:
                if (!this.value) {
                    this.onChange(undefined);
                }
                this.filterSearchList();
                if (this.searchList.length > 0) {
                    this.focusedItem = this.searchList[0];
                }
                break;
        }

        if (this.searchList.length == 0 || event.key == 'Enter') {
            this.dropdownTrigger.close();
        } else if (event.key != 'Escape' && !this.dropdownTrigger.dropDownOpen && this.searchList.length > 0) {
            this.dropdownTrigger.open();
        }

        this.cdRef.detectChanges();
    }

    /**
     * handle input focus and show the search list
     */
    public onFocus() {
        this.inputIsVisible = true;
    }

    /**
     * handle input blur the hide the result list
     */
    public onBlur() {
            this.value = undefined;
            this.inputIsVisible = false;
    }

    /**
     * handle result list item click
     * @param listItem
     * @param event
     * @private
     */
    public itemClicked(listItem: SystemSelectOptionI, event: MouseEvent) {
        this.emitValue(listItem);
        this.focusedItem = listItem;
        this.value = undefined;

        this.inputIsVisible = false;
    }

    /**
     * highlight the selected list items in the dom
     * @private
     */
    public filterSearchList() {
        this.focusedItem = undefined;

        this.searchList = this.generateSearchList();

        if (!this.value || this.searchList.length == 0) return;

        this.searchList = this.searchList.filter(e => e.isGroup || e.content.toLowerCase().indexOf(this.value.toLowerCase()) > -1);

        this.searchList.forEach(e => {

            const position = e.content.toLowerCase().indexOf(this.value.toLowerCase());

            if (position == -1) return;

            e.content = this.generateHighlightHTMLContent(e.content, position);
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
        if (!!this.focusedItem) {
            this.emitValue(this.focusedItem);
            this.value = undefined;
            this.inputIsVisible = false;
        } else if (this.emitInputValueOnEnterPress) {
            this.focusedItem = this.searchList.find(e => e.id == this.value);
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
        const groups = _.uniq(this.options.map(e => e.group));

        groups.forEach((g) => {

                if (!!g || (!g && groups.length > 1)) {
                    searchList.push(
                        {id: `${g}`, name: `${g}`, isGroup: true}
                    );
                }

                if (!this.sortReversed) {
                    this.options.filter(e => e.group == g)
                    .forEach((e) =>
                        searchList.push({id: e.value, name: e.display, content: e.displayselect ?? e.display, group: g, inactive: e.inactive})
                    );
                } else {
                    // reversed sorting (desc -> asc)
                    this.options.filter(e => e.group == g)
                    .forEach((e) =>
                        searchList.push({id: e.value, name: e.display, content: e.displayselect ?? e.display, group: g, inactive: e.inactive})
                    );
                }
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

        let list = !this.dropdownTrigger.dropDownOpen ? this.generateSearchList() : this.searchList;
        list = list.filter(e => !e.isGroup);

        if (list.length == 0) {
            return;
        }

        const direction = event.key == 'ArrowDown' ? 'down' : 'up';
        const currentIndex = !this.focusedItem ? 0 : list.findIndex(e => e.id == this.focusedItem.id);
        let nextItem = direction == 'down' ? list[currentIndex + 1] : list[currentIndex - 1];

        if (!this.focusedItem || !nextItem) {
            nextItem = list[0];
            this.focusedItem = nextItem;

        } else if (!!nextItem) {

            this.focusedItem = nextItem;
        }

        if (!this.dropdownTrigger.dropDownOpen && !!nextItem) {
            this.value = nextItem.name;
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
        this.focusedItem = undefined;
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
        inputContainer.click();
    }
}
