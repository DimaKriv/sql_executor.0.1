import renderer, { w } from '@dojo/framework/core/vdom';
import App from './App';

const r = renderer(() => w(App, {}));
const  domNode =  document.getElementById('app') as HTMLElement;
r.mount({domNode});
