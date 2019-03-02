/**
 * @module ObjectComponents
 */
import {Component, Input, Renderer2, ElementRef} from '@angular/core';
import {language} from '../../services/language.service';
import {modellist} from '../../services/modellist.service';

@Component({
    selector: 'object-list-header-actionmenu',
    templateUrl: './src/objectcomponents/templates/objectlistheaderactionmenu.html'
})
export class ObjectListHeaderActionMenu {

    @Input() actionset: string = '';

    menuOpen: boolean = false;
    clickListener: any;

    constructor(private modellist: modellist, private language: language, private renderer: Renderer2, private elementRef: ElementRef) {
    }

    get selectAll() {
        return this.modellist.listSelected.type === 'all';
    }

    setAllSelected() {
        this.menuOpen = false;
        this.modellist.setAllSelected();
    }

    setAllUnselected() {
        this.menuOpen = false;
        this.modellist.setAllUnselected();
    }

    toggleMenu() {
        this.menuOpen = !this.menuOpen;

        // toggle the listener
        if (this.menuOpen) {
            this.clickListener = this.renderer.listen('document', 'click', (event) => this.onClick(event));
        } else if (this.clickListener)
            this.clickListener();

    }

    public onClick(event: MouseEvent): void {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.menuOpen = false;
        }
    }

    hasSelection(){
        return this.modellist.getSelectedCount() > 0;
    }

}