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
    templateUrl: './app/systemcomponents/templates/systemselect.html'
})
export class SystemSelect implements OnChanges {
    @Input() selectList: any = [];
    @Input() label: string = "";
    @Input() selectedItem: any;
    @Input() disabled: boolean = false;

    @Output() selectedOutputItem: EventEmitter<any> = new EventEmitter<any>();

    searchList: Array<any> = [];
    show_list: boolean = false;
    clickListener: any;

    inputValue: string = "";
    selectedItemId: string = "";

    constructor(private elementRef: ElementRef, private renderer: Renderer2, private language: language) {


    }

    //  -- INPUT LIST STRUCTURE --
    // id
    // name
    // group (not available yet)

    ngOnChanges(changes: SimpleChanges) {

        if(changes.selectList !== undefined){
            this.searchList = this.selectList;

        }
        if(changes.selectedItem !== undefined){
            if(this.selectedItem) {
                this.inputValue = this.selectedItem.name;
                this.selectedItemId = this.selectedItem.id;
            }
        }
    }

    onKeydown(value){

        this.searchList = [];
        var copiedList = this.copyList();

        for(let item of copiedList){

            var name = item.name.toLowerCase();
            var inputValue = value.target.value.toLowerCase();

            var pos = name.search(inputValue);
            if(pos > -1){
                if(inputValue.length > 0) {
                    var boldadd = [item.name.slice(0, pos), "<mark>", item.name.slice(pos, pos + value.target.value.length), "</mark>", item.name.slice(pos + value.target.value.length)].join('');
                    item.name = boldadd;
                }
                this.searchList.push(item);
            }
        }
    }

    copyList(){

        var copiedList = [];

        for (var i = 0, len = this.selectList.length; i < len; i++) {
            copiedList[i] = {};
            for (var prop in this.selectList[i]) {
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
    onFocus() {
        this.show_list = true;
        this.clickListener = this.renderer.listen('document', 'click', (event) => this.clickOnSearch(event));
    }

    itemClicked(item){

        this.show_list = false;


        var outputItem;
        for(let arritem of this.selectList){
            if(arritem.id == item.id){
                outputItem = arritem;
                this.inputValue = arritem.name;
                this.selectedItemId = arritem.id;
            }
        }
        this.selectedOutputItem.emit(outputItem);
    }

}