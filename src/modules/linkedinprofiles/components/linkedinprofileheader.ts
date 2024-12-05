import { Component } from "@angular/core";
import {model} from "../../../services/model.service";
import {navigationtab} from "../../../services/navigationtab.service";


/* @ignore */

@Component({
    selector: "linkedinprofiles-header",
    templateUrl: "../templates/inkedinprofilesheader.html"
})

export class LinkedInProfilesHeader  {

    public componentconfig: any = {};

    constructor(
        public model: model,
        public navigationtab: navigationtab
    ) {
    }

    public cssStyles() {
        return {
            'border-radius': '50%',
            'margin-top': '-100px',
            'margin-left': '30px',
            'width': '150px',
            'border-width': '5px',
            'border-color': 'white',
            'border-style': 'solid'
        }
    }


    public getStyle(){
        return this.componentconfig.link ? {cursor: 'pointer'} : {};
    }

    public handleClick(){
        if(this.componentconfig.link){
            this.model.goDetail(this.navigationtab.tabid);
        }
    }
}
