/**
 * @module ModuleSalesPlanning
 */
import {Component, OnInit} from '@angular/core';
import {language} from '../../../services/language.service';
import {backend} from "../../../services/backend.service";
import {ActivatedRoute} from "@angular/router";
import {SalesPlanningService} from "../services/salesplanning.service";
import {model} from "../../../services/model.service";

@Component({
    templateUrl: './src/modules/salesplanning/templates/salesplanningtool.html',
    providers: [SalesPlanningService, model]
})

export class SalesPlanningTool implements OnInit {

    private isLoading: boolean = false;

    constructor(private language: language,
                private backend: backend,
                private activatedRoute: ActivatedRoute,
                private model: model,
                private planningService: SalesPlanningService) {
        model.module = 'SalesPlanningVersions';
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
            this.model.id = params.versionId;
            this.model.getData();
            this.getCharacteristicList();
        });
    }

    private getCharacteristicList() {
        this.planningService.characteristics = [];
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
