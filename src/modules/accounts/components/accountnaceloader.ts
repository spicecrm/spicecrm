/**
 * @module ModuleAccounts
 */
import {Component, OnInit} from '@angular/core';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {model} from '../../../services/model.service';
import {isNaN} from "underscore";

@Component({
    selector: 'account-nace-loadser',
    templateUrl: '../templates/accountnaceloader.html'
})
export class AccountNACELoader {

    public nacecoedsraw: string;

    public levels = 1;
    public treename: string = "industrycodes";
    public labelprefix: string = "LBL_NACE_";

    constructor(public language: language,
                public backend: backend) {

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
