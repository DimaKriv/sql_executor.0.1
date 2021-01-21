import {tsx} from '@dojo/framework/core/vdom';
import WidgetBase from '@dojo/framework/core/WidgetBase';
import CustomDialog from "./CustomDialog";
 import * as css from './styles/SQLStateDialog.m.css';
import {DgridWrapper} from "@dojo/interop/dgrid/DgridWrapper";

interface DialogState {
    state: boolean,
    result: boolean,
    message: {[key: string]: any}[]
}

enum Result {
    Success,
    Fail
}

export default class StateDialog extends WidgetBase<DialogState> {

    private resultHeader = ['Success', 'Error'];

    private isDialogOpen = true;

   private getCol() {
       let columns:{[key: string]: string} = {};
       if (this.properties.message[0]) {
           let key: string[] = Object.keys(this.properties.message[0]);
           for (let i = 0; i < key.length; i++) {
               columns[key[i]] = key[i];
           }
       }
       return columns;
   }

    protected render() {
       let message = this.properties.result ?
           <DgridWrapper data={this.properties.message} columns={this.getCol()}/>: <p>{this.properties.message}</p>;
        return <CustomDialog state={
            (!this.isDialogOpen && this.properties.state) || (this.isDialogOpen && !this.properties.state)
        } headerTitle={this.properties.result? this.resultHeader[Result.Success]: this.resultHeader[Result.Fail]}
                             maxWidth={300} classesHeader={this.properties.result? css.success: css.failed}>
            <div classes={css.message}>{message}</div>
        </CustomDialog>
    }
}