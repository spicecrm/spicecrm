/**
 * @module ModuleACL
 */
import {AfterViewInit, ComponentFactoryResolver, Component, ElementRef, NgModule, ViewChild, ViewContainerRef} from "@angular/core";
import {modelutilities} from "../../../services/modelutilities.service";
import {modellist} from "../../../services/modellist.service";

@Component({
    templateUrl: "../templates/aclobjectsmanager.html",
})
export class ACLObjectsManager {

    @ViewChild("managercontent", {read: ViewContainerRef, static: true}) elementmanagercontent: ViewContainerRef;

    public activeobjectid: string = "";
    public activetypeid: string = "";

    constructor(
        public modelutilities: modelutilities,
        public elementRef: ElementRef
    ) {}

    get contentStyle(){
        let rect = this.elementmanagercontent.element.nativeElement.getBoundingClientRect();
        return {
            height: "calc(100% - " + rect.top + "px"
        };
    }

    public setObject(objectid){
        this.activeobjectid = objectid;
    }

    public setType(typeid){
        this.activetypeid = typeid;
    }

}
