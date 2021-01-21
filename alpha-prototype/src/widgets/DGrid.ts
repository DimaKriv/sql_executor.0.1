import {create,invalidator, w, v} from '@dojo/framework/core/vdom';
import {Column, DgridWrapper} from "@dojo/interop/dgrid/DgridWrapper";
import  arrow  from "../icons/ArrowRight";
import successScroll from "../icons/SuccessScroll";
import failedScroll from "../icons/FailedScroll";
import * as css from "./styles/DGrid.m.css";
import {rootCell, rootTh} from "./styles/DGrid.m.css";
import Button from '@dojo/widgets/button';
import successCircle from '../icons/SuccessCircle';
import failedCircle from '../icons/FailedCircle';
import plus from '../icons/Pluss';
import {createResourceMiddleware} from '@dojo/framework/core/middleware/resources'
import {History} from "../resource/SQLHistoryResource";
import { node } from '@dojo/framework/core/vdom';
import SQLPrepareDialog from "./SQLPrepareDialog";
import SQLStateDialog from "./SQLStateDialog";
import icache from "@dojo/framework/core/middleware/icache";
import {filter, filtterCount, HistoryRepresent} from '../services/History'

const buttonClassInActive = {
    '@dojo/widgets/button': {
        root: [css.buttonRoot],
        label: [css.buttonLabel]
    }
};

// registry.define('dialog', Dialog);

const buttonClassActive = {
    '@dojo/widgets/button': {...buttonClassInActive['@dojo/widgets/button'], ...{
        root: [...buttonClassInActive['@dojo/widgets/button']['root'], css.buttonPressed]
    }}
};

let choosenButtonIndex = 0;

let buttonsState = [buttonClassActive, buttonClassInActive, buttonClassInActive, buttonClassInActive];

function createCustomColumn(label: string): Column {
    return {
        label,
        renderHeaderCell(node: HTMLElement): HTMLElement | void {
            node.setAttribute("class", css.rootTh);
            node.innerText = label;
        },
        className: css.rootCell
    };
}

let query:string|undefined;

let columnTitle = {
    result: {
        renderCell: (object: any, value: any, node: HTMLElement) => {
            node.setAttribute("class", css.rootThSmall + " " + rootCell);
            let image;
            if (value === true) {
                image = successScroll.get();
            } else {
                image = failedScroll.get();
            }
            return image;
        },
        renderHeaderCell(node: HTMLElement) {
            node.setAttribute("class", css.rootThSmall + " " + rootTh);
        }

 },
    statement: createCustomColumn("Statement"),
    exeDate: createCustomColumn('Execution Date'),
    exeTime: createCustomColumn('Execution Time'),
    exeSQl: {
        renderHeaderCell(node: HTMLElement) {
            node.setAttribute("class", css.rootThSmall + " " + css.rootTh);
        },
        renderCell(object: any, value: any, node: HTMLElement) {

        }
    }
};

let data: History[] = [];


let deialogResultOpen = false;
let dialogOpen = false;
// let dialogResultOpenPrev = false;

const resource = createResourceMiddleware<History>();
const factory = create({invalidator, resource, node, icache}).properties();

function doFilter(index: number) {
    buttonsState[choosenButtonIndex] = buttonClassInActive;
    buttonsState[index] = buttonClassActive;
    choosenButtonIndex = index;
}

export default factory(({id, properties, middleware: {invalidator, resource, icache}}) => {
    columnTitle.exeSQl.renderCell = (object: any, value: any, node: HTMLElement) => {
        node.setAttribute("class", css.rootThSmall + " " + css.rootCell);
        let el =  arrow.get();
        el.onclick = () => {
            dialogOpen = !dialogOpen;
            query = object.statement;
            invalidator();
        };
        return el;
    };
    const {getOrRead, createOptions} = resource;
    const {resource: {template, options = createOptions(id)}} = properties();
    [data = []] = getOrRead(template, options({size: Number.MAX_VALUE}));
    let {all, success, failed} = filtterCount(data);
    let filteredData: HistoryRepresent[] =  filter(choosenButtonIndex, data);
    return v("div", {}, [
        v('div', {classes:[css.buttonGroup]}, [
            w(Button, {onClick:() => {
                    doFilter(0);
                    invalidator();
                }, classes: buttonsState[0]}, [
                    v('span', {classes: [css.buttonLabelText]}
                    , ['All(', String(all), ')'])]),
            w(Button, {onClick:() => {
                doFilter(1);
                invalidator();
                }, classes: buttonsState[1]}, [
                    v('span',{classes: css.buttonLabelImg}
                    , [successCircle.vi()]),
                v('span', {classes: [css.buttonLabelText]}, [
                    ' Succeeded(', String(success), ')'])]),
            w(Button, {onClick:() => {
                doFilter(2);
                invalidator();
                }, classes: buttonsState[2]}, [
                v('span',{classes: css.buttonLabelImg}
                    , [failedCircle.vi()])
                ,v('span', {classes: [css.buttonLabelText]}, [
                    ' Failed(', String(failed), ')'])]),
            w(Button, { classes: buttonsState[3], onClick:() => {
                dialogOpen = !dialogOpen;
                query = "";
                invalidator();
                }}, [
                v('span',{classes: css.buttonLabelImg}
                    , [plus.vi()]),
                v('span', {classes: [css.buttonLabelText]}, [ ' Add new'])])]),
        w(DgridWrapper, {
            data: filteredData, columns: columnTitle}, []),
        w(SQLPrepareDialog, {state: dialogOpen, openResult: (message, result) => {
            deialogResultOpen = !deialogResultOpen;
            icache.set('message', message);
            icache.set('result', result);
            }, query: query}),
        w(SQLStateDialog, {state: deialogResultOpen, message: icache.getOrSet('message', [])
            , result: icache.getOrSet('result', false)})
])});