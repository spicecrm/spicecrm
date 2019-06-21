/**
 * @module SystemComponents
 */
import {Component, ViewChild, ViewContainerRef, EventEmitter, AfterViewInit} from "@angular/core";

@Component({
    selector: "system-component-container",
    templateUrl: "./src/systemcomponents/templates/systemcomponentcontainer.html"
})
export class SystemComponentContainer implements AfterViewInit {

    @ViewChild("container", {read: ViewContainerRef, static: false}) private container: ViewContainerRef;
    private containerRef: EventEmitter<any> = new EventEmitter<any>()

    private loaded: false;
    public containerComponent: string = "";

    public ngAfterViewInit() {
        this.containerRef.emit(this.container);
        this.containerRef.complete();
    }

}