/**
 * @module ModuleAccounts
 */
import {Component, OnInit} from '@angular/core';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {model} from '../../../services/model.service';
import {isNaN} from "underscore";
import {modal} from "../../../services/modal.service";

@Component({
    selector: 'account-nace-loadser',
    templateUrl: '../templates/accountnaceloader.html'
})
export class AccountNACELoader  implements OnInit{

    public nacecoedsraw: string;

    public levels = 1;
    public treename: string = "industrycodes";
    public labelprefix: string = "LBL_NACE_";

    constructor(public language: language,
                public modal: modal,
                public backend: backend) {

    }

    /**
     * loads aa  stored file fromt eh server
     */
    ngOnInit() {
        this.backend.getRequest('common/nace').subscribe({
            next: (files) => {
                if(files && files.length > 0){

                    let options = files.map(f => { return {value: f, display: f}});

                    this.modal.prompt('input', null, 'select codes file', 'shade', null, options).subscribe({
                        next: (file) => {
                            this.backend.getRequest('common/nace/'+file).subscribe({
                              next: (res) => {
                                  this.nacecoedsraw = res.content;
                              }
                            })
                        }
                    })
                }
            }
        })
    }

    get parsedCodes(){
        if(!this.nacecoedsraw) return [];

        let nacelines = [];
        let lines = this.nacecoedsraw.replace(/"/g, "").split(/\r?\n/);

        for(let line of lines){
            let nace = line.split(';');
            if(isNaN(parseInt(nace[0], 10)) || parseInt(nace[0], 10) > this.levels) continue;

            nacelines.push({
                level: nace[0],
                nace: nace[1],
                label: nace[3]
            })
        }

        return nacelines;
    }

    public save(){
        this.backend.postRequest('common/nace', {}, {
            treename: this.treename,
            labelprefix: this.labelprefix,
            nacecodes: this.parsedCodes
        }).subscribe({
            next: () => {
                console.log('OK');
            }
        })
    }

}
