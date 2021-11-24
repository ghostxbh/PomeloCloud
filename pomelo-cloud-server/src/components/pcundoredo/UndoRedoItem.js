'use strict';

/**
 * code by PomeloCloud
 * undo/redo 栈
 */
class UndoRedoItem {
  constructor() {
    this.undoStack = new Stack();
    this.redoStack = new Stack();
  }

  undo(item, fn) {
    if (this.undoStack.isEmpty()) {
      return;
    }
    return this.undoStack.pop();
  }

  redo(item, fn) {
    if (this.redoStack.isEmpty()) {
      return;
    }
    return this.redoStack.pop();
  }

  _addRedo(redoItem) {
    this.redoStack.push(redoItem);
  }

  _addUndo(undoItem) {
    this.undoStack.push(undoItem);
  }
}
