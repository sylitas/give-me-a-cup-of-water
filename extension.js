const vscode = require('vscode');

let yourHP = 100;
let interval;

const notification = async () => {
  const selection = await vscode.window.showWarningMessage('[👴🏻]: Are you gonna stand up ?', 'Do it now', 'Later');

  if (selection === 'Do it now') {
    if (yourHP === 100) {
      vscode.window.showInformationMessage('[👴🏻]: Nice! Keep bringing me my water!');
    } else {
      yourHP += 20;
      vscode.window.showInformationMessage(`[👴🏻]: My hydrate point: ${yourHP}%`);
    }
  } else {
    if (yourHP === 0) {
      const loseSelection = await vscode.window.showErrorMessage('[👴🏻]: I am dead, Start again?', 'Again', 'Nope');
      if (loseSelection === 'Again') {
        yourHP = 100;
        clearInterval(interval);
        vscode.commands.executeCommand('give-me-a-cup-of-water.start');
        vscode.window.showInformationMessage(`[👴🏻]: I'm survived, My hydrate point: ${yourHP}%`);
      } else {
        clearInterval(interval);
      }
    } else {
      yourHP -= 20;
      vscode.window.showInformationMessage(`[👴🏻]: My hydrate point: ${yourHP}%`);
    }
  }
};

/**
 * @param {vscode.ExtensionContext} context
 */
const activate = (context) => {
  vscode.window.showInformationMessage(`[👴🏻]: Hi 👋, My hydrate point: ${yourHP}%`);

  let time = vscode.workspace.getConfiguration('GiveMeACupOfWater').get('time');
  // Add Event Lister
  vscode.workspace.onDidChangeConfiguration(() => {
    time = vscode.workspace.getConfiguration('GiveMeACupOfWater').get('time');
    if (interval) clearInterval(interval);
    vscode.commands.executeCommand('give-me-a-cup-of-water.start');
    vscode.window.showInformationMessage('Apply new setting successfully');
  });
  // Adding command
  const giveMeWater = vscode.commands.registerCommand('give-me-a-cup-of-water.start', () => {
    interval = setInterval(() => {
      notification();
    }, time * 6e4);
  });
  context.subscriptions.push(giveMeWater);

  // Execute command
  vscode.commands.executeCommand('give-me-a-cup-of-water.start');
};

const deactivate = () => {
  if (interval) clearInterval(interval);
};

module.exports = {
  activate,
  deactivate,
};
