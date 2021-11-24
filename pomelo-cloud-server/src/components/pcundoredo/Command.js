'use strict';

/**
 * code by PomeloCloud
 * 命令
 */
class Command {
  constructor(receiver, data) {
    this.receiver = receiver;
    this.data = data;
    this.undoRedo = null;
    this.undoRedoOptions = {};
  }

  execute() {
    throw Error('please implement execute function!');
  }

  undo() {
    throw Error('please implement undo function!');
  }

  initUndoRedo(undoRedo, options) {
    this.undoRedo = undoRedo;
    this.undoRedoOptions = options;
    return this;
  }

  undoable() {
    const command = this;

    this.undoRedo.undoable({
      undoFn: command.undo,
      redoFn: command.execute,
      thisArg: command,
      ...this.undoRedoOptions,
    });

    return command;
  }
}
