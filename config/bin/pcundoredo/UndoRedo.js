'use strict';
/**
 * code by PomeloCloud
 * undo/redo
 */
class UndoRedo {
  constructor() {
    this.undoStack = new Stack();
    this.redoStack = new Stack();
  }

  undoable(options) {
    const {
      thisArg = null,
      undoFn = noop,
      redoFn = noop,
      undoArgs = [],
      redoArgs = [],
    } = options;

    this.undoStack.push(
      {
        undoFn: undoFn.bind(thisArg, undoArgs),
        redoFn: redoFn.bind(thisArg, redoArgs),
      },
    );
  }

  undo() {
    if (this.undoStack.isEmpty()) {
      return;
    }
    const obj = this.undoStack.pop();
    typeof obj.undoFn === 'function' && obj.undoFn();
    this._addRedo(obj);
  }

  redo() {
    if (this.redoStack.isEmpty()) {
      return;
    }
    const obj = this.redoStack.pop();
    typeof obj.redoFn === 'function' && obj.redoFn();
    this._addUndo(obj);
  }

  _addRedo(redoItem) {
    this.redoStack.push(redoItem);
  }

  _addUndo(undoItem) {
    this.undoStack.push(undoItem);
  }
}
