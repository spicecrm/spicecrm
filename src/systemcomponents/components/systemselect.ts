import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    Renderer2,
    SimpleChanges
} from '@angular/core';
import {language} from '../../services/language.service';

@Component({
    selector: 'system-select',
    templateUrl: './src/systemcomponents/templates/systemselect.html'
})
export class SystemSelect implements OnChanges {
    @Input() private selectList: any = [];
    @Input() private label: string = "";
    @Input() private selectedItem: any;
    @Input() private disabled: boolean = false;

    @Output() private selectedItemChange: EventEmitter<any> = new EventEmitter<any>();
    @Output() private selectedOutputItem: EventEmitter<any> = new EventEmitter<any>();

    private searchList: Array<any> = [];
    private show_list: boolean = false;
    private clickListener: any;
    private inputValue: string = "";
    private selectedItemId: string = "";

    constructor(private elementRef: ElementRef, private renderer: Renderer2, private language: language) {}

    //  -- INPUT LIST STRUCTURE --
    // id
    // name
    // group (not available yet)

    public ngOnChanges(changes: SimpleChanges) {
        if(changes.selectList !== undefined) {
            this.searchList = this.selectList;

        }
        if(changes.selectedItem !== undefined){
            if(this.selectedItem) {
                this.inputValue = this.selectedItem.name;
                this.selectedItemId = this.selectedItem.id;
            }
        }
    }

    public onKeydown(value) {
        this.searchList = [];
        let copiedList = this.copyList();

        for(let item of copiedList){
            let name = item.name.toLowerCase();
            let inputValue = value.target.value.toLowerCase();

            let pos = name.search(inputValue);
            if(pos > -1) {
                if(inputValue.length > 0) {
                    let boldadd = [item.name.slice(0, pos), "<mark>", item.name.slice(pos, pos + value.target.value.length), "</mark>", item.name.slice(pos + value.target.value.length)].join('');
                    item.name = boldadd;
                }
                this.searchList.push(item);
            }
        }
    }

    private copyList() {
        let copiedList = [];

        for (let i = 0, len = this.selectList.length; i < len; i++) {
            copiedList[i] = {};
            for (let prop in this.selectList[i]) {
                copiedList[i][prop] = this.selectList[i][prop];
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
        this.clickListener = this.renderer.listen('document', 'click', (event) => this.clickOnSearch(event));
    }

    private itemClicked(item) {
        this.show_list = false;

        let outputItem;
        for(let arritem of this.selectList){
            if(arritem.id == item.id){
                outputItem = arritem;
                this.inputValue = arritem.name;
                this.selectedItemId = arritem.id;
            }
        }
        this.selectedOutputItem.emit(outputItem);
        this.selectedItemChange.emit(outputItem);
    }
}
