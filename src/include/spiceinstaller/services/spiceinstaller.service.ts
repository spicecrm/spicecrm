/**
 * @module SpiceInstaller
 */
import {EventEmitter, Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

interface thisStep {
    id: string;
    name: string;
    visible: boolean;
    completed: boolean;
}


@Injectable()
export class spiceinstaller {
    stepComp: EventEmitter<any> = new EventEmitter();
    public selectedStep$: EventEmitter<thisStep> = new EventEmitter<thisStep>();
    public steps: any = [];
    public configBody$: Observable<any>;
    public configBodySubject = new BehaviorSubject<any>({});
    public currentStep$: Observable<any>;
    public currentStepBS = new BehaviorSubject<any>({});
    private _selectedStep: thisStep;

    constructor() {
        this._selectedStep = {
            id: 'setbackend',
            name: 'Set Backend',
            visible: true,
            completed: false,
        };
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

    get selectedStep() {
        return this._selectedStep;
    }

    set selectedStep(selectedStep: thisStep) {
        this._selectedStep = selectedStep;
        this.selectedStep$.emit(this._selectedStep);
    }

    setStepComp(step) {
        this.stepComp.emit(step);
    }


    public configBody(data) {
        this.configBodySubject.next(data);
    }

    public currentStep(step) {
        this.currentStepBS.next(step);
    }

}
