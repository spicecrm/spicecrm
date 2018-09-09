import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: '[system-table-stencils]',
    templateUrl: './app/systemcomponents/templates/systemtablestencils.html'
})
export class SystemTableStencils implements OnInit{

    @Input() columns: number = 1;
    @Input() rows: number = 5;
    @Input() tools: boolean = false;
    @Input() select: boolean = false;

    colArray: Array<any> = [];
    rowArray: Array<any> = [];

    constructor() {

    }

    ngOnInit(){
        // build columns
        let i = 1;
        do{
            this.rowArray.push(i);
            i++;
        }while(i <= this.rows)

        // build rows
        let j = 1;
        do{
            this.colArray.push(j);
            j++;
        }while(j <= this.columns)
    }

    linestyle(index){
        return {
            opacity: 0.5 + (0.5 / index)
        }
    }
}