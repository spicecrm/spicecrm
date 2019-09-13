/**
 * @module ModuleSalesPlanning
 */
import {Component, OnInit} from '@angular/core';
import {language} from '../../../services/language.service';
import {backend} from "../../../services/backend.service";
import {ActivatedRoute} from "@angular/router";
import {SalesPlanningService} from "../services/salesplanning.service";

@Component({
    templateUrl: './src/modules/salesplanning/templates/salesplanningtool.html',
    providers: [SalesPlanningService]
})

export class SalesPlanningTool implements OnInit {

    private isLoading: boolean = false;
    constructor(private language: language, private backend: backend, private activatedRoute: ActivatedRoute, private planningService: SalesPlanningService) {
    }

    get selectedNode() {
        return this.planningService.selectedNode;
    }

    get characteristicsLoaded() {
        return this.planningService.characteristics.length > 0;
    }

    public ngOnInit() {
        this.activatedRoute.params.subscribe(params => {
            this.planningService.versionId = params.versionId;
            this.getCharacteristicList();
        });
    }

    private getCharacteristicList() {
        this.isLoading = true;
        this.backend.getRequest(`module/SalesPlanningNodes/version/${this.planningService.versionId}/CharacteristicList`)
            .subscribe(char => {
                if (char && char.data) {
                    this.planningService.characteristics = char.data;
                    this.isLoading = false;
                }
            });
    }
}
