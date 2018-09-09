import {Component, Input, Output, EventEmitter, Renderer, ElementRef, OnInit} from '@angular/core';
import { ActivatedRoute }   from '@angular/router';
import { modellist } from '../../services/modellist.service';
import { language } from '../../services/language.service';
import { metadata } from '../../services/metadata.service';
import { model } from '../../services/model.service';

@Component({
    selector: 'object-listview-header-list-selector',
    templateUrl: './app/objectcomponents/templates/objectlistviewheaderlistselector.html'
})
export class ObjectListViewHeaderListSelector implements OnInit{
    @Input() parentconfig: any = [];
    @Output() changelist = new EventEmitter<string>();
    showMenu: boolean = false;
    clickListener: any;
    currentList: string = '';

    constructor(private metadata: metadata, private activatedRoute: ActivatedRoute, private modellist: modellist, private language: language, private model: model, private elementRef: ElementRef, private renderer: Renderer) {

    }

    ngOnInit(){
        this.currentList = this.parentconfig.defaultlist;
    }

    toggleMenu(){
        this.showMenu = !this.showMenu;
        if (this.showMenu) {
            this.clickListener = this.renderer.listenGlobal('document', 'click', (event) => this.onClick(event));
        } else if (this.clickListener)
            this.clickListener();
    }

    public onClick(event: MouseEvent): void {
        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.showMenu = false;
            this.clickListener();
        }
    }

    getIcon(){
        let icon: string = '';
        if(this.parentconfig.lists) {
            this.parentconfig.lists.some(list => {
                if (list.component == this.currentList) {
                    icon = list.icon;
                    return true;
                }
            })
        }

        return icon;
    }

    disabled(){
        return !(this.parentconfig.lists.length > 1);
    }

    getLists(){
        return this.parentconfig.lists;
    }

    setListtype(component){
        this.currentList = component;
        this.changelist.emit(component);
    }

}