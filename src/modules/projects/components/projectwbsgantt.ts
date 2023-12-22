/**
 * @module ModuleProjects
 */
import {Component, OnDestroy, OnInit} from "@angular/core";
import {model} from "../../../services/model.service";
import {projectwbsHierarchy} from "../services/projectwbshierarchy.service";
import moment from "moment";
import DurationConstructor = moment.unitOfTime.DurationConstructor;
import {SpiceGanttService} from "../../../include/SpiceGantt/services/spicegantt.service";

@Component({
    selector: "projectwbs-gantt",
    templateUrl: "../templates/projectwbsgantt.html",
    providers: [SpiceGanttService]
})
export class ProjectWBSGantt implements OnInit, OnDestroy {
    public self: any
    public items = [];
    public milestones = []
    private _zoomLevel: DurationConstructor = null
    
    get zoomLevel() {
        return this._zoomLevel as DurationConstructor
    }

    set zoomLevel(level: DurationConstructor) {
        this._zoomLevel = level
    }

    constructor(
        public projectwbsHierarchy: projectwbsHierarchy,
        public model: model,
        public spiceGanttService: SpiceGanttService
    ) {
    }

    public ngOnInit() {
        this.items = this.projectwbsHierarchy.members.map(t => ({
            id: t.id,
            name: t.data.name,
            start: t.data.date_start.format("YYYY-MM-DD HH:mm:ss"),
            end: t.data.date_end.format("YYYY-MM-DD HH:mm:ss"),
            type: 'wbs',
            // duration: t.data.date_end.diff(t.data.date_start, 'days'),
            progress: t.data.level_of_completion ? t.data.level_of_completion / 100 : 0,
            parent: t.data.parent_id,
        }));

        this.milestones = []
    }

    /**
     * load google maps library and call renderMap method
     * load cluster library and set the marker clusterer if the direction service is inactive
     */
    public loadNecessaryLibraries() {
        /*
        this.libloader.loadLib('dhtmlx.gantt').subscribe(() => {
            gantt.config.xml_date = "%Y-%m-%d %H:%i";
            gantt.config.readonly = true;
            gantt.config.columns = [
                {name:"text",       label:"Task name",  width: 250, tree:true },
                {name:"start_date", label:"Start time", width: 100,  align:"center" },
                {name:"end_date", label:"End Date", width: 100, align:"center" }
            ];
            gantt.config.grid_width = 450;
            const zoomConfig = {
                levels: [
                    {
                        name:"day",
                        scale_height: 27,
                        min_column_width:80,
                        scales:[
                            {unit: "day", step: 1, format: "%d %M"}
                        ]
                    },
                    {
                        name:"week",
                        scale_height: 50,
                        min_column_width:50,
                        scales:[
                            {unit: "week", step: 1, format: (date) => {
                                    let dateToStr = gantt.date.date_to_str("%d %M");
                                    let endDate = gantt.date.add(date, 6, "day");
                                    let weekNum = gantt.date.date_to_str("%W")(date);
                                    return "#" + weekNum + ", " + dateToStr(date) + " - " + dateToStr(endDate);
                                }},
                            {unit: "day", step: 1, format: "%j %D"}
                        ]
                    },
                    {
                        name:"month",
                        scale_height: 50,
                        min_column_width:120,
                        scales:[
                            {unit: "month", format: "%F, %Y"},
                            {unit: "week", format: "Week #%W"}
                        ]
                    },
                    {
                        name:"quarter",
                        height: 50,
                        min_column_width:90,
                        scales:[
                            {unit: "month", step: 1, format: "%M"},
                            {
                                unit: "quarter", step: 1, format: (date) => {
                                    let dateToStr = gantt.date.date_to_str("%M");
                                    let endDate = gantt.date.add(gantt.date.add(date, 3, "month"), -1, "day");
                                    return dateToStr(date) + " - " + dateToStr(endDate);
                                }
                            }
                        ]},
                    {
                        name:"year",
                        scale_height: 50,
                        min_column_width: 30,
                        scales:[
                            {unit: "year", step: 1, format: "%Y"}
                        ]}
                ]
            };
            gantt.ext.zoom.init(zoomConfig);

            let tasks = [];
            let links = [];

            for(let t of this.projectwbsHierarchy.members){
                tasks.push({
                    id: t.id,
                    text: t.data.name,
                    start_date: t.data.date_start.format("YYYY-MM-DD HH:mm:ss"),
                    duration: t.data.date_end.diff(t.data.date_start, 'days'),
                    progress:t.data.level_of_completion ? t.data.level_of_completion / 100 : 0,
                    parent: t.data.parent_id
                });
            }

            gantt.config.scales = [
                {unit: "month", step: 1, format: "%F, %Y"},
                {unit: "day", step: 1, format: "%j, %D"}
            ];

            gantt.init(this.ganttContainer.nativeElement);
            gantt.parse({tasks, links});
            gantt.ext.zoom.setLevel("quarter");
        });

        */
    }

    public close() {
        this.self.destroy();
    }

    public ngOnDestroy() {
    }
}
