import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    Renderer2,
    SimpleChanges
} from "@angular/core";
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

    @Output() public selectedOutputItem: EventEmitter<any> = new EventEmitter<any>();

    private searchList: any = [];
    private show_list: boolean = false;
    private clickListener: any;

    private inputValue: string = "";
    private selectedItemId: string = "";

    constructor(private elementRef: ElementRef, private renderer: Renderer2, private language: language) {


    }

    //  -- INPUT LIST STRUCTURE --
    // id
    // name
    // group

    public ngOnChanges(changes: SimpleChanges) {
        if(changes.selectList !== undefined) {
            let result = this.listBuilder(this.selectList);
            this.searchList = result;

        }
        if(changes.selectedItem !== undefined) {
            if(this.selectedItem) {
                this.inputValue = this.selectedItem.name;
                this.selectedItemId = this.selectedItem.id;
            }
        }
    }

    get getDropdownLength() {
        return "slds-dropdown_length-" + this.listheight;
    }

    private onKeydown(value) {

        this.searchList = [];
        let copiedList = this.copyList();
        let contentCheck = false;

        for (let listGroup in copiedList) {
            for (let item of copiedList[listGroup]) {
                let name = item.name.toLowerCase();
                let inputValue = value.target.value.toLowerCase();

                let pos = name.search(inputValue);
                if (pos > -1) {
                    if (inputValue.length > 0) {
                        contentCheck = true;
                        let boldadd = [item.name.slice(0, pos), "<mark>", item.name.slice(pos, pos + value.target.value.length), "</mark>", item.name.slice(pos + value.target.value.length)].join("");
                        item.name = boldadd;
                    }
                    if(this.searchList[listGroup]) {
                        this.searchList[listGroup].push(item);
                    }else {
                        this.searchList[listGroup] = [];
                        this.searchList[listGroup].push(item);
                    }
                }
            }
        }
        if(contentCheck) {
            this.show_list = true;
        } else {
            this.show_list = false;
        }
    }

    private listBuilder(buildList) {
        let result = [] ;
        for(let searchItem of buildList) {
            if(searchItem.hasOwnProperty('group')) {
                if (!result[searchItem.group]) {
                    result[searchItem.group] = [];
                }
            }else {
                let un = '_undefined';
                searchItem.group = un;
                if (!result[un]) {
                    result[un] = [];
                }
            }
            result[searchItem.group].push({ id: searchItem.id, name: searchItem.name });
        }
        return result;
    }

    private copyList() {
        let copiedList = [];
        let result = this.listBuilder(this.selectList);
        for(let listGroup in result) {
            copiedList[listGroup] = [];
            for (let i = 0, len = result[listGroup].length; i < len; i++) {
                copiedList[listGroup][i] = [];
                for (let prop in result[listGroup][i]) {
                    copiedList[listGroup][i][prop] = result[listGroup][i][prop];
                }
            }
        }
        return copiedList;
    }


    public clickOnSearch(event: MouseEvent): void {

        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.show_list = false;
        }
    }
    private onFocus() {
        this.show_list = true;
        this.clickListener = this.renderer.listen("document", "click", (event) => this.clickOnSearch(event));
    }

    private itemClicked(item) {

        this.show_list = false;


        let outputItem;
        for(let arritem of this.selectList){
            if(arritem.id == item.id) {
                outputItem = arritem;
                this.inputValue = arritem.name;
                this.selectedItemId = arritem.id;
            }
        }
        this.selectedOutputItem.emit(outputItem);
    }

}
