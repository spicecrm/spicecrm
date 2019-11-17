/**
 * @module SystemComponents
 */
import {Component, ElementRef, EventEmitter, Input, OnChanges, Output, Renderer2, SimpleChanges} from "@angular/core";
import {language} from "../../services/language.service";

@Component({
    selector: "system-select",
    templateUrl: "./src/systemcomponents/templates/systemselect.html"
})
export class SystemSelect implements OnChanges {
    @Input() public selectList: any = [];
    @Input() public label: string = "";
    @Input() public selectedItem: any;
    @Input() public listheight: string = "7";
    @Input() public disabled: boolean = false;
    @Input() public emitInputValueOnEnterPress: boolean = false;

    @Output() public selectedItemChange: EventEmitter<any> = new EventEmitter<any>();

    private searchList: any = [];
    private show_list: boolean = false;
    private clickListener: any;

    constructor(private elementRef: ElementRef, private renderer: Renderer2, private language: language) {


    }

    //  -- INPUT LIST STRUCTURE --
    // id
    // name
    // group

    get getDropdownLength() {
        return "slds-dropdown_length-" + this.listheight;
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.selectList !== undefined) {
            this.searchList = this.listBuilder(this.selectList);
        }
    }

    public clickOnSearch(event: MouseEvent): void {

        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.show_list = false;
        }
    }

    private onKeydown(value) {
        this.searchList = [];
        let copiedList = this.copyList();
        let contentCheck = false;
        let inputValue = value.target.value.toLowerCase();

        if (value.key == 'Enter' && this.emitInputValueOnEnterPress) this.selectedItemChange.emit(inputValue);

        for (let listGroup in copiedList) {
            for (let item of copiedList[listGroup]) {
                let name = item.name.toLowerCase();

                let pos = name.search(inputValue);
                if (pos > -1) {
                    if (inputValue.length > 0) {
                        contentCheck = true;
                        item.name = [item.name.slice(0, pos), "<mark>", item.name.slice(pos, pos + value.target.value.length), "</mark>", item.name.slice(pos + value.target.value.length)].join("");
                    }
                    if (this.searchList[listGroup]) {
                        this.searchList[listGroup].push(item);
                    } else {
                        this.searchList[listGroup] = [];
                        this.searchList[listGroup].push(item);
                    }
                }
            }
        }
        this.show_list = contentCheck;
    }

    private listBuilder(buildList) {
        let result = [];
        for (let searchItem of buildList) {
            if (searchItem.hasOwnProperty('group')) {
                if (!result[searchItem.group]) {
                    result[searchItem.group] = [];
                }
            } else {
                let un = '_undefined';
                searchItem.group = un;
                if (!result[un]) {
                    result[un] = [];
                }
            }
            result[searchItem.group].push({id: searchItem.id, name: searchItem.name});
        }
        return result;
    }

    private copyList() {
        let copiedList = [];
        let result = this.listBuilder(this.selectList);
        for (let listGroup in result) {
            copiedList[listGroup] = [];
            for (let i = 0, len = result[listGroup].length; i < len; i++) {
                copiedList[listGroup][i] = [];
                for (let prop in result[listGroup][i]) {
                    if (result[listGroup][i].hasOwnProperty(prop)) {
                        copiedList[listGroup][i][prop] = result[listGroup][i][prop];
                    }
                }
            }
        }
        return copiedList;
    }

    private onFocus() {
        this.show_list = true;
        this.clickListener = this.renderer.listen("document", "click", (event) => this.clickOnSearch(event));
    }

    private itemClicked(item) {
        this.show_list = false;

        this.selectList.some(listItem => {
            if (listItem.id == item.id) {
                this.selectedItemChange.emit(listItem);
                return true;
            }
        });
    }

}
