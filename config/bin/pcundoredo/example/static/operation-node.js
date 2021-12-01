var $moveup = $('#moveup'), $movedown = $('#movedown'),
  $undo = $('#undo'), $redo = $('#redo'),
  $cut = $('#cut'), $copy = $('#copy'),
  $paste = $('#paste'), $delete = $('#delete');

// 节点上移
$moveup.click(function() {
  if (checkCurrent()) return;
  var nodeIndex = zTreeObj.getNodeIndex(currentSelectedNode);
  if (nodeIndex > 0) {
    var parentNode = currentSelectedNode.getParentNode();
    var childrenArr = parentNode.children;
    zTreeObj.moveNode(childrenArr[nodeIndex - 1], currentSelectedNode, 'prev', false);
  }
  common.saveZNodesToLocalStorage();
});

// 节点下移
$movedown.click(function() {
  if (checkCurrent()) return;
  var nodeIndex = zTreeObj.getNodeIndex(currentSelectedNode);
  var parentNode = currentSelectedNode.getParentNode();
  var childrenArr = parentNode.children;
  if (nodeIndex < childrenArr.length - 1) {
    zTreeObj.moveNode(childrenArr[nodeIndex + 1], currentSelectedNode, 'next', false);
  }
  common.saveZNodesToLocalStorage();
});

// 剪切
$cut.click(function() {
  if (checkCurrent('不能剪切主程序节点')) return;
  copyNode = currentSelectedNode;
  zTreeObj.removeNode(currentSelectedNode);
  common.saveZNodesToLocalStorage();
});

// 复制
$copy.click(function() {
  if (checkCurrent('不能复制主程序节点')) return;
  copyNode = currentSelectedNode;
});

// 粘贴
$paste.click(function() {
  if (!copyNode) return;
  if (!currentSelectedNode) {
    alert('没有选中节点');
    return;
  }
  if (currentSelectedNode.type === 'ROOT') {
    zTreeObj.addNodes(currentSelectedNode, 0, copyNode, false);
    return;
  }
  var parentNode = currentSelectedNode.getParentNode();
  var nodeIndex = zTreeObj.getNodeIndex(currentSelectedNode);
  zTreeObj.addNodes(parentNode, nodeIndex + 1, copyNode, false);

  var parentTId = currentSelectedNode.parentTId;
  var nodeArr = zTreeObj.getNodeByParam('tId', parentTId).children;
  zTreeObj.selectNode(nodeArr[nodeIndex + 1]);
  currentSelectedNode = nodeArr[nodeIndex + 1];
  common.saveZNodesToLocalStorage();
});

// 删除节点
$delete.click(function() {
  if (checkCurrent('不能删除主程序节点')) return;
  var nodeType = currentSelectedNode.type;
  if (nodeType === 'BEFORESTART') {
    beforeStartHasChecked = false;
    zTreeObj.removeNode(currentSelectedNode);
  } else if (nodeType === 'VARIABLES') {
    initialVariablesHasChecked = false;
    zTreeObj.removeNode(currentSelectedNode);
  } else {
    var nodeIndex = zTreeObj.getNodeIndex(currentSelectedNode);
    var nodeArr = currentSelectedNode.getParentNode().children;
    zTreeObj.removeNode(currentSelectedNode);
    if (nodeArr.length < 1) {
      var parentNode = currentSelectedNode.getParentNode();
      zTreeObj.selectNode(parentNode);
      currentSelectedNode = parentNode;
    } else {
      zTreeObj.selectNode(nodeArr[nodeIndex - 1]);
      currentSelectedNode = nodeArr[nodeIndex - 1];
    }
  }
  common.saveZNodesToLocalStorage();
});

$undo.click(function() {
  const undo = undoRedo.undo();
  zTreeObj.removeNode(undo);
});

$redo.click(function() {
  const redo = undoRedo.redo();
  const parentNode = zTreeObj.getNodeByParam('tId', redo.parentTId);
  zTreeObj.addNodes(parentNode, redo);
});
