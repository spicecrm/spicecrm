/*!
 * 
 *                     aacService
 *
 *                     release: 2023.03.001
 *
 *                     date: 2024-01-03 13:43:56
 *
 *                     build: 2023.03.001.1704285836024
 *
 */
"use strict";(self.webpackChunkcore=self.webpackChunkcore||[]).push([["src_include_spicecharts_spicecharts_ts"],{24972:(e,t,r)=>{r.r(t),r.d(t,{SpiceChartsModule:()=>C});var a=r(44755),s=r(95030),n=r(84357),c=r(53190),o=r(34826),i=r(19784),l=r(57239),p=r(62242),d=r(42067);const u=["chartcontainer"];let h=(()=>{class SpiceChart{libLoader;chartContainer;chart;constructor(e){this.libLoader=e}ngAfterViewInit(){this.loadNecessaryLibraries()}loadNecessaryLibraries(){this.libLoader.loadLib("chartjs").subscribe((()=>{this.renderchart()}))}renderchart(){const e={type:"bar",data:{labels:["January","February","March","April","May","June"],datasets:[{backgroundColor:getComputedStyle(document.documentElement).getPropertyValue("--brand-primary"),borderColor:getComputedStyle(document.documentElement).getPropertyValue("--brand-primary"),data:[0,10,5,2,20,30,45]}]},options:{plugins:{legend:{display:!1}}}};this.chart=new Chart(this.chartContainer.nativeElement,e)}static ɵfac=function(e){return new(e||SpiceChart)(p.Y36(d.$))};static ɵcmp=p.Xpm({type:SpiceChart,selectors:[["spice-chart"]],viewQuery:function(e,t){if(1&e&&p.Gf(u,5),2&e){let e;p.iGM(e=p.CRH())&&(t.chartContainer=e.first)}},decls:3,vars:0,consts:[[1,"slds-size--1-of-1",2,"height","400px"],["chartcontainer",""]],template:function(e,t){1&e&&(p.TgZ(0,"div",0),p._UZ(1,"canvas",null,1),p.qZA())},encapsulation:2})}return SpiceChart})(),C=(()=>{class SpiceChartsModule{static ɵfac=function(e){return new(e||SpiceChartsModule)};static ɵmod=p.oAB({type:SpiceChartsModule});static ɵinj=p.cJS({imports:[a.ez,s.u5,c.ObjectFields,o.GlobalComponents,i.ObjectComponents,l.SystemComponents,n.o]})}return SpiceChartsModule})();("undefined"==typeof ngJitMode||ngJitMode)&&p.kYT(C,{declarations:[h],imports:[a.ez,s.u5,c.ObjectFields,o.GlobalComponents,i.ObjectComponents,l.SystemComponents,n.o]})}}]);