class HideElCommand extends Command {
  constructor(receiver, data) {
    super(receiver, data);
  }

  execute() {
    // this.receiver.style.display = 'none';
    return this;
  }

  // undo() {
  //   const showElCommand = ShowElCommand.of(this.receiver, this.data)(this.undoRedo, this.undoRedoOptions);
  //   showElCommand.execute();
  //   return this;
  // }

  static of(receiver, data) {
    return function(undoRedo, options) {
      return new HideElCommand(receiver, data).initUndoRedo(undoRedo, options);
    };
  }
}
