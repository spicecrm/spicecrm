import {AfterViewInit, ComponentFactoryResolver, Component, ElementRef, NgModule, ViewChild, ViewContainerRef} from "@angular/core";
import {modelutilities} from "../../../services/modelutilities.service";
import {modellist} from "../../../services/modellist.service";

@Component({
    templateUrl: "./src/modules/acl/templates/aclobjectsmanager.html",
})
export class ACLObjectsManager {

    @ViewChild("managercontent", {read: ViewContainerRef}) elementmanagercontent: ViewContainerRef;

    private activeobjectid: string = "";
    private activetypeid: string = "";

    constructor(
        private modelutilities: modelutilities,
        private elementRef: ElementRef
    ) {}

    get contentStyle(){
        let rect = this.elementmanagercontent.element.nativeElement.getBoundingClientRect();
        return {
            height: "calc(100% - " + rect.top + "px"
        };
    }

    private setObject(objectid){
        this.activeobjectid = objectid;
    }

    private setType(typeid){
        this.activetypeid = typeid;
    }

}
