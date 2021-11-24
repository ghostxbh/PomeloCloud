class CommandObj {
  constructor(li) {
    this.li = li;//存储操作对象属性
  }

  execute() {

  }

  //撤销
  undo() {
    this.li.insertAfter(this.li.next());
  }

  //重写
  redo() {
    this.li.insertBefore(this.li.prev());
  }
}
