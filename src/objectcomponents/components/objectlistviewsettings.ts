
import {AfterViewInit, ComponentFactoryResolver,HostListener, ElementRef, Component, Renderer2} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Router, ActivatedRoute}   from '@angular/router';
import {metadata} from '../../services/metadata.service';
import { modellist } from '../../services/modellist.service';
import { modal } from '../../services/modal.service';
import { language } from '../../services/language.service';
import {ObjectListViewSettingsAddlistModal} from "./objectlistviewsettingsaddlistmodal";
import {ObjectListViewSettingsSetfieldsModal} from "./objectlistviewsettingssetfieldsmodal";

@Component({
    selector: 'object-listview-settings',
    templateUrl: './app/objectcomponents/templates/objectlistviewsettings.html',

})
export class ObjectListViewSettings{
    showMenu: boolean = false;
    showAddModal: boolean = false;
    showDeleteModal: boolean = false;
    showDisplayfieldsModal: boolean = false;
    modalMode: string = 'add';
    clickListener: any;

    constructor(private language: language, private elementRef: ElementRef, private modal: modal, private modellist: modellist, private renderer: Renderer2){

    }

    toggleMenu(){
        this.showMenu = !this.showMenu;

        if (this.showMenu) {
            this.clickListener = this.renderer.listen('document', 'click', (event) => this.onClick(event));
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

    add(){
        this.modal.openModal('ObjectListViewSettingsAddlistModal').subscribe(modalref => {
            modalref.instance.modellist = this.modellist;
            modalref.instance.modalmode = 'add';
        })
    }

    edit(){
        this.modal.openModal('ObjectListViewSettingsAddlistModal').subscribe(modalref => {
            modalref.instance.modellist = this.modellist;
            modalref.instance.modalmode = 'edit';
        })
    }

    setfields(){
        this.modal.openModal('ObjectListViewSettingsSetfieldsModal').subscribe(modalref => {
            modalref.instance.modellist = this.modellist;
        })
    }

    deleteDisabled(){
        return !this.modellist.canDelete();
    }

    delete(){
        this.modal.openModal('ObjectListViewSettingsDeletelistModal').subscribe(modalref => {
            modalref.instance.modellist = this.modellist;
        })
    }

}