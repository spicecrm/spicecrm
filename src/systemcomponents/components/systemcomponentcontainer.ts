import {Component, OnInit,ViewChild, ViewContainerRef, EventEmitter, AfterViewInit} from '@angular/core';
import {toast} from '../../services/toast.service';

@Component({
    selector: 'system-component-container',
    templateUrl: './src/systemcomponents/templates/systemcomponentcontainer.html'
})
export class SystemComponentContainer implements AfterViewInit{

    @ViewChild('container', {read: ViewContainerRef}) container: ViewContainerRef;
    containerRef: EventEmitter<any> = new EventEmitter<any>()

    loaded: false;

    constructor() {}

    ngAfterViewInit(){
        this.containerRef.emit(this.container);
        this.containerRef.complete();
    }

}