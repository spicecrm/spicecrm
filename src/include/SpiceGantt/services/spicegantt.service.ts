import {Injectable} from '@angular/core';
import {language} from "../../../services/language.service";
import {model} from "../../../services/model.service";
import {backend} from "../../../services/backend.service";
import {clone} from "underscore";
import moment, {isDate} from "moment";

/* @ignore */
declare var _: any;

const zoomLevels = {
    'YEAR': {
        unitOfTime: 'months',
        labels: moment.monthsShort(),
        unit: (containerWidth: number) => containerWidth / 12,
        factor: 31
    },
    'QUARTER': {
        unitOfTime: 'quarter',
        labels: moment.monthsShort(),
        unit: (containerWidth: number) => containerWidth / 3,
        factor: 31
    },
    'MONTH': {
        unitOfTime: 'days',
        labels: Array.from(new Array(31), (x, i) => i + 1),
        unit: (containerWidth: number) => containerWidth / 31,
        factor: 1
    },
    'WEEK': {
        unitOfTime: 'days',
        labels: moment.weekdaysShort(),
        unit: (containerWidth: number) => containerWidth / 7,
        factor: 1
    }
}

@Injectable()

export class SpiceGanttService {
    private _items = []
    private _milestones = []

    constructor() {
        this._containerId = (Math.random() * new Date().getUTCMilliseconds()).toString()

        for (let i = 0; i < 30; i++) {
            const id = Math.random() * 10000000
            const name = `name-${i}`
            const start = moment(new Date(new Date().valueOf() - Math.random() * (1000 * 60 * 60 * 24 * 31)))
            const end = start.clone().add(Math.random() * 10000, 'hours')

            this._items.push({id, name, start, end})
        }

    }

    /*
        NODE HANDLING
    */
    public addItem(item) {
        this._items.push(item)
    }

    public addMilestone(milestone) {
        this._milestones.push(milestone)
    }

    get milestones() {
        return this._milestones
    }

    get tree() {
        return this.buildTree(this._items);
    }

    get flat() {
        return this._items
    }

    public buildTree(flatItems, parent = '') {
        return flatItems
            .filter(item => item.parent === parent)
            .map(item => {
                return {
                    ...item,
                    items: this.buildTree(flatItems, item.id)
                }
            })
    }

    setNode(id, obj, recursive = false) {
        let nestedIDs = []

        if (recursive) {
            nestedIDs = this.getNestedChildrenIds(id)
        }

        this._items = this._items.map(item => {
            if (item.id === id || nestedIDs.includes(item.id)) {
                item = {...item, ...obj}
            }

            return item
        })
    }

    private getNestedChildrenIds(id) {
        return this.getChildren(id).map(item => {
            return [
                item.id,
                ...this.getNestedChildrenIds(item.id)
            ]
        }).flat()
    }

    public getParent(id) {
        const node = this._items.find(item => item.id === id)
        if (!!node) {
            const parent = this._items.find(item => item.id === node.parent)
            if (!!parent) return parent

            return {
                expanded: true
            }
        }

        return null
    }

    public getChildren = (id: string) => this._items.filter(item => item.parent === id)

    public reset = () => this._items = []

    /*
        SCALING AND DISPLAYING GANTT-ITEMS
    */
    private _containerId: string = ''
    private _containerWidth = 0
    private _containerHeight: number = 0
    private _containerTop: number = 0
    private _zoomLevel: string = 'MONTH'

    private _showMilestones: boolean = true

    get containerId(): string {
        return this._containerId
    }

    get containerTop(): number {
        return this._containerTop
    }

    set containerTop(top: number) {
        this._containerTop = top
    }

    get containerWidth(): number {
        return this._containerWidth
    }

    set containerWidth(width) {
        this._containerWidth = width

        console.log('container-width', width)
    }

    get containerHeight(): number {
        return this.itemHeight * this._items.filter(item => item.expanded === true || this.getParent(item.id).expanded || !item.parent).length
    }

    set containerHeight(height: number) {
        this._containerHeight = height
    }

    get itemHeight(): number {
        return 37
    }

    get zoomLevel(): string {
        return this._zoomLevel
    }

    set zoomLevel(type: string) {
        this._zoomLevel = type
    }

    get sizeOfUnit(): number {
        return zoomLevels[this._zoomLevel].unit(this._containerWidth)
    }

    get sizeFactor(): number {
        return zoomLevels[this._zoomLevel].factor
    }

    get headerLabels(): string[] {
        let labels = zoomLevels[this._zoomLevel].labels

        const start = this.bounds.min
        const end = this.bounds.max

        let labelsToShow = []
        let nextAera = null
        let nextLabelIndex = null
        let diff = 0

        switch (this._zoomLevel) {
            case 'YEAR':
                diff = end.diff(start, 'days', true)
                break
            case 'QUARTER':
                diff = end.diff(start, 'months', true)
                break
            case 'MONTH':
                labels = Array.from(new Array(start.daysInMonth()), (x, i) => i + 1)
                diff = end.diff(start, 'days', true)
                break
            case 'WEEK':
                diff = end.diff(start, 'days', true)
                break
        }

        for (let i: number = 0; i <= (diff < labels.length - 1 ? labels.length - 1 : diff); i++) {
            switch (this._zoomLevel) {
                case 'YEAR':
                    // moment.add is mutable!!! so cloning is necessary
                    nextAera = start.clone().add(i, 'month')
                    nextLabelIndex = this.cycleLabels(labels.length, nextAera.month())
                    break
                case 'QUARTER':
                    nextAera = start.clone().add(i, 'month')
                    nextLabelIndex = this.cycleLabels(labels.length, nextAera.month())
                    break
                case 'MONTH':
                    nextAera = start.clone().add(i, 'day')
                    // moment.date() return 1-based index!!!
                    nextLabelIndex = this.cycleLabels(labels.length, nextAera.date() - 1)
                    break
                case 'WEEK':
                    nextAera = start.clone().add(i, 'day')
                    nextLabelIndex = this.cycleLabels(labels.length, nextAera.weekday())
                    break
            }

            labelsToShow = [...labelsToShow, labels[nextLabelIndex]]
        }

        return labelsToShow
    }

    private cycleLabels(length: number, index: number): number {
        return (index >= length) ? index - length : ((index < 0) ? length - 1 : index)
    }

    get sizeOfLabelUnit(): number {
        return this._containerWidth / this.headerLabels.length
    }

    get minDate(): moment.Moment {
        const sorted = this.sortDates(clone(this._items), 'start')
        if (sorted.length) return moment(new Date(sorted[0].start)).hour(0)
        return moment(new Date())
    }

    get maxDate(): moment.Moment {
        const sorted = this.sortDates(clone(this._items), 'end').reverse()
        if (sorted.length) return moment(new Date(sorted[0].end)).hour(24)
        return moment(new Date()).add(1, 'year')
    }

    get bounds(): { min: moment.Moment, max: moment.Moment } {
        // return min and max Date from list of tasks for now
        // might later be used for general scaling
        let lowerBound = this.minDate
        const upperBound = this.maxDate

        // deal with zoomlevels
        // quarters want to start at the beginning of specific months
        switch (this._zoomLevel) {
            case 'WEEK':
                lowerBound = lowerBound.day(0)
                break
            case 'MONTH':
                lowerBound = lowerBound.date(1)
                break
            case 'QUARTER':
                // get current minDate month, and move lower bounds to current possible quarter
                const startMonthForQuarter = [0, 3, 6, 9].reduce((acc: number, month: number): number => {
                    return ((this.minDate.month() - month) < acc) ? month : acc
                }, 3)
                lowerBound = lowerBound.month(startMonthForQuarter)
                break
            case 'YEAR':
                lowerBound = lowerBound.month(0).date(1)
                break
        }

        return {
            min: lowerBound,
            max: upperBound
        }
    }

    public getItemPosition(start: moment.Moment): number {
        const days = start.diff(this.bounds.min, 'hours', true) / 24
        return this.sizeOfUnit * days / this.sizeFactor
    }

    public getItemLength(start: moment.Moment, end: moment.Moment): number {
        const diff = end.diff(start, 'hours', true)
        return this.sizeOfUnit * (diff / 24 / this.sizeFactor)
    }

    private sortDates =
        (items: any[], key: string) => items.sort((a, b) => (a[key] > b[key]) ? 1 : ((a[key] < b[key]) ? -1 : 0))

    private _changeZoomLevel(direction = -1) {
        const zlLength = Object.values(zoomLevels).length
        let currentIndex = Object.keys(zoomLevels).findIndex(zl => zl === this._zoomLevel)
        if (currentIndex !== -1) {
            currentIndex = currentIndex + direction
            if (currentIndex >= zlLength) currentIndex = 0
            if (currentIndex < 0) currentIndex = zlLength - 1

            this.zoomLevel = Object.keys(zoomLevels)[currentIndex]
        }
    }

    public zoomIn() {
        this._changeZoomLevel(+1)
    }

    public zoomOut() {
        this._changeZoomLevel(-1)
    }

    get showMilestones() {
        return this._showMilestones
    }

    public toggleMilestones() {
        this._showMilestones = !this._showMilestones
    }

    public goTo() {
        const diff = moment(new Date()).diff(this.bounds.min, 'hours', true)
        const left = this.sizeOfUnit * diff / this.sizeFactor / 24
        document.getElementById(this.containerId).scrollTo({left})
    }
}