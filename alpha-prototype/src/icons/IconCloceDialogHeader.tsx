import {tsx, create} from '@dojo/framework/core/vdom';
import Icon from '@dojo/widgets/icon';
import * as css from './style/IconCloseDialogHeader.m.css';
import icache from '@dojo/framework/core/middleware/icache';



interface IconEvent {
    onclick: () => void;
}

const factory = create({icache}).properties<IconEvent>();


export default factory(({properties, middleware:{icache}}) => {
    const {onclick} = properties();
    return <span classes={icache.getOrSet<string[]>("styles",[css.root, css.onleave])}
    onmouseenter={() => {
        icache.set<string[]>('styles', [css.root, css.onenter])
    }}
    onmouseleave={() => {
        icache.set<string[]>('styles', [css.root, css.onleave])
    }}
    onclick={() =>{
        onclick()
    }}
    >
        <Icon type = "closeIcon"/></span>
    }
);