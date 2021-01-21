import { create, w } from '@dojo/framework/core/vdom';
import Header from '@dojo/widgets/header';
import * as css from './styles/Menu.m.css';

const extraClasses = {
	'@dojo/widgets/header': {
		root: [css.root],
		title: [css.title]
	}
};

const factory = create();

export default factory(function Menu() {
	return w(Header, {classes: extraClasses}, [
		{
			title: 'SQL Executor v0.2',

		}
	]);
});
