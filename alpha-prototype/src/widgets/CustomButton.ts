import { create, v, w} from '@dojo/framework/core/vdom';
import Button from '@dojo/widgets/button/index';
import * as css from './styles/CustomButton.m.css';

const extraClasses = {
    '@dojo/widgets/button': {
        root: [css.root],
        label: [css.label]
    }
};

const factory = create().properties<{text: string, func: (() => void) | undefined}>();

export default factory(({properties}) =>
{
    const { text, func } = properties();
    return v('div', [
        w(Button, {classes: extraClasses, onClick: func}, [text])]);
}
);