/**
 * @module ModuleSalesPlanning
 */
import {Injectable} from '@angular/core';

@Injectable()

export class SalesPlanningService {
    public versionId: string = '';
    public characteristicTerritory: string = '_territories';
    public characteristics: any[] = [];
    public selectedCharacteristics: any[] = [];
    public contentFields: any[] = [];
    public selectedNode: any;
    public selectedNodes: any[] = [];

    get selectedCharacteristicIds() {
        return this.selectedCharacteristics.map(char => char.id);
    }
}
