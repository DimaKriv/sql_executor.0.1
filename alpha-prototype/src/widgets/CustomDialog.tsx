import {create, invalidator, tsx} from '@dojo/framework/core/vdom'
import * as css from './styles/CustomDialog.m.css';
import dimensions from '@dojo/framework/core/middleware/dimensions';
import resize from '@dojo/framework/core/middleware/resize';
import IconCloseDialogHeader from '../icons/IconCloceDialogHeader';
import icache from "@dojo/framework/core/middleware/icache";

interface State {
    state: boolean,
    maxWidth: number,
    headerTitle: string,
    classesRoot ?: string,
    classesHeader ?: string
}

function styleBoxPosition(reactiveDom: {width: number, height: number}, dialogDim:  {width: number, height: number}
, maxWidth: number): string {
    let offsetDialog = "";
        if (reactiveDom.width > maxWidth) {
            offsetDialog += " left: " + Math.round((reactiveDom.width - maxWidth) / 2) + "px;";
            offsetDialog += "width: " + maxWidth +"px;";
        } else {
            offsetDialog += " left: 0;";
            offsetDialog += " width: " + Math.round(reactiveDom.width) + "px;";
            offsetDialog += " min-width: 200px;";
        }
        if (reactiveDom.height - dialogDim.height > 0)
            offsetDialog += " top: " + Math.round((reactiveDom.height - dialogDim.height) / 2) +"px;";
    return offsetDialog;
}

function openCloseDialogClasses(state: boolean, isDialogOpen: (boolean| undefined)): string[] {
    if ((!isDialogOpen && state) || (isDialogOpen && !state))  return [css.wrapper];
    else  return [css.wrapper, css.closedWrapper];
}

const factory = create({invalidator, dimensions, resize, icache}).properties<State>().children();

export default factory(({children, properties, middleware: {invalidator, dimensions, resize, icache}}) => {
    const {state, maxWidth, headerTitle, classesHeader, classesRoot} = properties();
    icache.getOrSet<boolean>('isDialogOpen', true);
    const myChildren = children();
    let reactiveDom = resize.get('dialogCustomBackGround');
    let dialogDim = dimensions.get("dialogCustom");
    let offsetDialog = "";
    if (reactiveDom && dialogDim)
    offsetDialog = styleBoxPosition({width:reactiveDom.width, height: reactiveDom.height}
    , {width:dialogDim.client.width, height: dialogDim.client.height}, maxWidth);
    let wrapperClass = openCloseDialogClasses(state, icache.get('isDialogOpen'));
    //icache.get<boolean>('isDialogOpen'));
    return (
        <div classes={wrapperClass}>
            <div classes={[css.root, classesRoot]} key="dialogCustom" style={offsetDialog}>
            <h2 classes={[css.header, classesHeader]}><span>{headerTitle}</span>
                <IconCloseDialogHeader onclick={() => {
                    icache.set('isDialogOpen',  !icache.get('isDialogOpen'));
                    invalidator()
                    //console.log(icache.get<boolean>('isDialogOpen'));
                    //icache.set<boolean>('isDialogOpen', !icache.get<boolean>('isDialogOpen'));
                }}/>
            </h2>
            <hr style="margin:0;"/>
                {myChildren.map(e => <div>{e}</div>)}
            </div>
            <div classes={css.background} key="dialogCustomBackGround"/>
        </div>)
});