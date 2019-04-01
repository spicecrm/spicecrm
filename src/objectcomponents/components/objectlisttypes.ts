/**
 * @module ObjectComponents
 */
import { Component, ElementRef, Renderer2} from '@angular/core';
import { modellist } from '../../services/modellist.service';
import { language } from '../../services/language.service';

@Component({
    selector: 'object-list-types',
    templateUrl: './src/objectcomponents/templates/objectlisttypes.html'
})
export class ObjectListTypes{

    constructor(private modellist: modellist, private elementRef: ElementRef, private renderer: Renderer2, private language: language){}

    showMenu: boolean = false;
    clickListener: any;

    get listtypes() {
        return this.modellist.getListTypes(false);
    }

    get myLabel(){
        return this.language.getLabel('LBL_MY') + ' ' + this.language.getModuleName(this.modellist.module);
    }


    get allLabel(){
        return this.language.getLabel('LBL_ALL') + ' ' + this.language.getModuleName(this.modellist.module);
    }


    toggleTypes(){
        this.showMenu = !this.showMenu;

        if (this.showMenu) {
            this.clickListener = this.renderer.listen('document', 'click', (event) => this.onClick(event));
        } else if (this.clickListener)
            this.clickListener();
    }

    setListType(id = 'all'){
        this.modellist.setListType(id);
        this.showMenu = false;
    }

    public onClick(event: MouseEvent): void {
        if (!event.target) {
            return;
        }

        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.showMenu = false;
        }
    }
}