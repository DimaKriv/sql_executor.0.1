import { create, v, w } from '@dojo/framework/core/vdom';
import theme from '@dojo/framework/core/middleware/theme';
import dojo from '@dojo/widgets/theme/dojo';
import Menu from './widgets/Menu';
import DGrid from "./widgets/DGrid";
import {createResourceMiddleware} from "@dojo/framework/core/middleware/resources";
import {template} from './resource/SQLHistoryResource'
import * as css from './App.m.css';
import CustomTextReverser from "./widgets/CustomTextReverser";

const resource = createResourceMiddleware();
const factory = create({ theme, resource });

export default factory(function App({ id, middleware: { theme, resource } }) {
	if (!theme.get()) {
		theme.set(dojo);
	}
	return v('div', { classes: [css.root] }, [
		w(Menu, {}),
		v('div', {classes: [css.main]}, [
		w(CustomTextReverser, {}),
		w(DGrid, {resource: resource({template})}, [])
	])]);
});
