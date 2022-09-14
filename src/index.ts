import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
// import { IEditorTracker } from '@jupyterlab/fileeditor';
import { INotebookTracker } from '@jupyterlab/notebook';
// import { ICommandPalette } from '@jupyterlab/apputils';
// import { ISettingRegistry } from '@jupyterlab/settingregistry';
// import { Cell } from '@jupyterlab/cells';

import { CodeMirrorEditor, ICodeMirror } from '@jupyterlab/codemirror';

import * as _ from 'underscore';

class SqlCodeMirror {
  constructor(
    protected app: JupyterFrontEnd,
    protected tracker: INotebookTracker,
    protected code_mirror: ICodeMirror
  ) {
    console.log('first time');
    console.log(this.tracker.currentWidget);
    this.tracker?.activeCellChanged?.connect(() => {
      console.log('inside activecellchanged connect');
      console.log('tracker: ' + this.tracker);
      // console.log('editor_tracker: ' + this.editor_tracker);
      console.log('code_mirror: ' + code_mirror);
      console.log('activeCell: ' + this.tracker.activeCell);
      if (this.tracker?.activeCell !== null) {
        console.log('inside !== null statement');
        // this.setup_cell_editor(this.tracker?.activeCell);
        const cell = this.tracker.activeCell;
        if (cell !== null && cell?.model.type === 'code') {
          const code_mirror_editor = cell?.editor as CodeMirrorEditor;
          const debounced_on_change = _.debounce(() => {
            // check for editor with first line starting with %%sql
            console.log('bounce');
            const line = code_mirror_editor
              .getLine(code_mirror_editor.firstLine())
              ?.trim();
            if (line?.startsWith('%%sql')) {
              code_mirror_editor.editor.setOption('mode', 'text/x-sql');
            } else {
              code_mirror_editor.editor.setOption('mode', 'text/x-ipython');
            }
          }, 300);
          code_mirror_editor.editor.on('change', debounced_on_change);
          console.log('test');
          debounced_on_change();
        }
      }
    });
    // setup newly open editors
    // this.editor_tracker.widgetAdded.connect((sender, widget) =>
    //   this.setup_file_editor(widget.content, true)
    // );
    // refresh already open editors when activated (because the MIME type might have changed)
    // this.editor_tracker.currentChanged.connect((sender, widget) => {
    //   if (widget !== null) {
    //     this.setup_file_editor(widget.content, false);
    //   }
    // });
  }

  // refresh_state() {
  //   // update the active cell (if any)
  //   if (this.tracker.activeCell !== null) {
  //     this.setup_cell_editor(this.tracker.activeCell);
  //   }

  //   // update the current file editor (if any)
  //   if (this.editor_tracker.currentWidget !== null) {
  //     this.setup_file_editor(this.editor_tracker.currentWidget.content);
  //   }
  // }

  // setup_file_editor(file_editor: FileEditor, setup_signal = false): void {
  //   if (setup_signal) {
  //     file_editor.model.mimeTypeChanged.connect((model, args) => {
  //       // putting at the end of execution queue to allow the CodeMirror mode to be updated
  //       setTimeout(() => this.setup_file_editor(file_editor), 0);
  //     });
  //   }
  // }

  // setup_cell_editor(cell?: Cell): void {
  //   console.log('attaching' + cell);
  //   if (cell !== null && cell?.model.type === 'code') {
  //     const code_mirror_editor = cell.editor as CodeMirrorEditor;
  //     const debounced_on_change = _.debounce(() => {
  //       // check for editor with first line starting with %%sql
  //       console.log('bounce');
  //       const line = code_mirror_editor
  //         .getLine(code_mirror_editor.firstLine())
  //         ?.trim();
  //       if (line?.startsWith('%%sql')) {
  //         code_mirror_editor.editor.setOption('mode', 'text/x-sql');
  //       } else {
  //         code_mirror_editor.editor.setOption('mode', 'text/x-ipython');
  //       }
  //     }, 300);
  //     code_mirror_editor.editor.on('change', debounced_on_change);
  //     debounced_on_change();
  //   }
  // }

  // extract_editor(cell_or_editor: Cell | FileEditor): CodeMirror.Editor {
  //   const editor_temp = cell_or_editor.editor as CodeMirrorEditor;
  //   return editor_temp.editor;
  // }
}

function activate(
  app: JupyterFrontEnd,
  tracker: INotebookTracker,
  code_mirror: ICodeMirror
): void {
  new SqlCodeMirror(app, tracker, code_mirror);
  console.log('SQLCodeMirror loaded.');
}

/**
 * Initialization data for the jupyterlabs_sql_codemirror extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: '@composable/jupyterlabs-sql-codemirror',
  autoStart: true,
  requires: [INotebookTracker, ICodeMirror],
  optional: [],
  activate: activate
};

export default extension;
