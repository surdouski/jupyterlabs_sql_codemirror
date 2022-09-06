import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

/**
 * Initialization data for the sql_code_highlighting extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'sql_code_highlighting:plugin',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension sql_code_highlighting is activated!');
  }
};

export default plugin;
