/**
 * @module SpiceInstaller
 */
import {Injectable, EventEmitter} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from "rxjs";


@Injectable()
export class spiceinstaller {
    stepComp:EventEmitter<any> = new EventEmitter();
    public steps: any = [];
    public configBody$: Observable<any>;
    public configBodySubject= new BehaviorSubject<any>({});
    public currentStep$: Observable<any>;
    public currentStepBS = new BehaviorSubject<any>({});
    constructor() {
        this.configBody$ = this.configBodySubject.asObservable();
        this.currentStep$ = this.currentStepBS.asObservable();
        this.steps = [
            {
              id: 'setbackend',
              name: 'Set Backend',
              visible: true,
              completed: false,
            },
            {
                id: 'systemcheck',
                name: 'System Requirements',
                visible: false,
                completed: false,
            },
            {
                id: 'licence',
                name: 'Licence',
                visible: false,
                completed: false,
            },
            {
                id: 'database',
                name: 'Database',
                visible: false,
                completed: false,
            },
            {
                id: 'fts',
                name: 'FTS',
                visible: false,
                completed: false
            },
            {
                id: 'reference',
                name: 'Reference',
                visible: false,
                completed: false
            },
            {
                id: 'review',
                name: 'Review and Install',
                visible: false,
                completed: false
            }
        ];
    }

    setStepComp(step) {
        this.stepComp.emit(step);
    }


    public configBody(data){
        this.configBodySubject.next(data);
    }

    public currentStep(step) {
        this.currentStepBS.next(step);
    }

}
