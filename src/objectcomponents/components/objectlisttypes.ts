/**
 * @module ObjectComponents
 */
import {Component, ElementRef, Renderer2} from '@angular/core';
import {modellist} from '../../services/modellist.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'object-list-types',
    templateUrl: './src/objectcomponents/templates/objectlisttypes.html'
})
export class ObjectListTypes {

    constructor(private modellist: modellist, private elementRef: ElementRef, private renderer: Renderer2, private language: language) {
    }

    private showMenu: boolean = false;
    private clickListener: any;

    get listtypes() {
        return this.modellist.getListTypes(false).sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
    }

    private toggleTypes() {
        this.showMenu = !this.showMenu;

        if (this.showMenu) {
            this.clickListener = this.renderer.listen('document', 'click', (event) => this.onClick(event));
        } else if (this.clickListener) {
            this.clickListener();
        }
    }

    private setListType(id = 'all') {
        this.modellist.setListType(id);
        this.showMenu = false;
    }

    /**
     * for handling the simle dorpdowntrigger
     *
     * @param event
     */
    public onClick(event: MouseEvent): void {
        if (!event.target) {
            return;
        }

        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.showMenu = false;
        }
    }

    /**
     * returns a list type icon indicating if this is a peronal or a global list
     *
     * @param listtype
     */
    private getListtypeIcon(listtype) {
        return listtype.global && listtype.global != '0' ? 'world' : 'user';
    }

}
