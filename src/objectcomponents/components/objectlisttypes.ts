/**
 * @module ObjectComponents
 */
import {Component, ElementRef, Renderer2} from '@angular/core';
import {modellist} from '../../services/modellist.service';
import {language} from '../../services/language.service';
import {ListTypeI} from "../../services/interfaces.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'object-list-types',
    templateUrl: '../templates/objectlisttypes.html'
})
export class ObjectListTypes {
    /**
     * holds the list types
     */
    public listTypes: ListTypeI[] = [];
    public subscription = new Subscription();

    constructor(public modellist: modellist, public elementRef: ElementRef, public renderer: Renderer2, public language: language) {
        this.initialize();
    }

    /**
     * disable if there can onlybe one list selected
     */
    get disabled() {
        return (this.modellist.standardLists.length + this.listTypes.length <= 1);
    }

    /**
     * load the list types and subscribe to list type changes
     * @private
     */
    public initialize() {
        this.setListTypes();
        this.subscription = this.modellist.listType$.subscribe(() => {
            this.setListTypes();
        });
    }

    public setListTypes() {
        this.listTypes = this.modellist.getListTypes(false)
            .map(type => ({...type, icon: type.global && type.global != '0' ? 'world' : 'user'}))
            .sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
    }

    public showMenu: boolean = false;

    public setListType(id = 'all') {
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
    public getListtypeIcon(listtype) {
        return listtype.global && listtype.global != '0' ? 'world' : 'user';
    }

}
