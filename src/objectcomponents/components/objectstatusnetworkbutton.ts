/**
 * @module ObjectComponents
 */
import {Component,  Renderer2, ElementRef, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'object-status-network-button',
    templateUrl: './src/objectcomponents/templates/objectstatusnetworkbutton.html'
})
export class ObjectStatusNetworkButton implements OnInit{

    isOpen: boolean = false;
    clickListener: any;
    statusField: string = '';
    statusNetwork: Array<any> = [];
    prmiaryStatus: any = {};
    secondaryStatuses: Array<any> = [];

    constructor(private language: language, private metadata: metadata, private model: model, private router: Router, private renderer: Renderer2, private elementRef: ElementRef) {

    }

    get isDisabled(){
        return this.model.isEditing || !this.model.checkAccess('edit');
    }

    get isManaged(){
        return this.statusField != '' && this.primaryItem !== false && !this.isDisabled;
    }

    get primaryItem() {
        for (let statusnetworkitem of this.statusNetwork) {
            if (statusnetworkitem.status_from == this.model.getField(this.statusField)) {
                return statusnetworkitem;
            }
        }

        return false;
    }

    get secondaryItems(){
        let retArray = []; let firstHit = false;
        for (let statusnetworkitem of this.statusNetwork) {
            if (statusnetworkitem.status_from == this.model.getField(this.statusField)) {

                if(firstHit){
                    retArray.push(statusnetworkitem);
                }

                if(!firstHit) firstHit = true;
            }
        }
        return retArray
    }

    ngOnInit(){
        let statusmanaged = this.metadata.checkStatusManaged(this.model.module);
        if(statusmanaged != false){
            this.statusField = statusmanaged.statusField;
            this.statusNetwork = statusmanaged.statusNetwork;
        }
    }

    toggleOpen(){
        this.isOpen = !this.isOpen;

        // toggle the listener
        if (this.isOpen) {
            this.clickListener = this.renderer.listen('document', 'click', (event) => this.onClick(event));
        } else if (this.clickListener)
            this.clickListener();
    }

    public onClick(event: MouseEvent): void {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.isOpen = false;
        }
    }

    private closeDropdown(){
        this.isOpen = false;
    }

    setStatus(newStatus){
        this.model.startEdit();
        this.model.setField(this.statusField, newStatus);
        if(this.model.validate()){
            this.model.save()
        } else {
            this.model.edit();
        }
    }

}