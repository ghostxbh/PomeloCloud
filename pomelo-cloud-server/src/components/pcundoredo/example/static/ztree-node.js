var $assignment = $('#assignment'), $comment = $('#comment'),
  $direction = $('#direction'), $folder = $('#folder'),
  $halt = $('#halt'), $move = $('#move'),
  $waypoint = $('#waypoint'), $wait = $('#wait'),
  $set = $('#set'), $popup = $('#popup');

var $loop = $('#loop'), $if = $('#if'), $thread = $('#thread');

var $force = $('#force'), $pallet = $('#pallet'),
  $screwdriving = $('#screwdriving'), $seek = $('#seek');

// 添加移动节点
$move.click(function() {
  if (checkIsInitVariables()) return;
  var newNode = common.addMovePoint();
  var nodeType = currentSelectedNode.type;
  var startNode = zTreeObj.getNodeByParam('type', 'BEFORESTART');
  var rootNode = zTreeObj.getNodeByParam('type', 'ROOT');
  if (nodeType === 'BEFORESTART') {
    var nodes = zTreeObj.addNodes(startNode, 0, newNode);
    zTreeObj.selectNode(nodes[0]);
    currentSelectedNode = nodes[0];
  } else if (nodeType === 'ROOT') {
    var nodes = zTreeObj.addNodes(rootNode, 0, newNode);
    zTreeObj.selectNode(nodes[0]);
    currentSelectedNode = nodes[0];
  } else {
    var index = zTreeObj.getNodeIndex(currentSelectedNode);
    var parentTId = currentSelectedNode.parentTId;
    zTreeObj.addNodes(currentSelectedNode.getParentNode(), index + 1, newNode);

    var parentNode = zTreeObj.getNodeByParam('tId', parentTId);
    var nodeArr = parentNode.children;
    zTreeObj.selectNode(nodeArr[index + 1]);
    currentSelectedNode = nodeArr[index + 1];
  }

  common.saveZNodesToLocalStorage();
});

// 添加路点
$waypoint.click(function() {
  if (checkIsInitVariables()) return;
  var newNode = common.addMovePoint();
  var nodeType = currentSelectedNode.type;
  var startNode = zTreeObj.getNodeByParam('type', 'BEFORESTART');
  var rootNode = zTreeObj.getNodeByParam('type', 'ROOT');
  if (!nodeType || nodeType === 'BEFORESTART') {
    var nodes = zTreeObj.addNodes(startNode, 0, newNode);
    zTreeObj.selectNode(nodes[0]);
    currentSelectedNode = nodes[0];
  } else if (!nodeType || nodeType === 'ROOT') {
    var nodes = zTreeObj.addNodes(rootNode, 0, newNode);
    zTreeObj.selectNode(nodes[0]);
    currentSelectedNode = nodes[0];
  } else {
    var newPoint = common.addPoint();
    var parentNode = currentSelectedNode.getParentNode();
    var index = zTreeObj.getNodeIndex(currentSelectedNode);
    if (parentNode && parentNode.type === 'MOVE') {
      zTreeObj.addNodes(currentSelectedNode.getParentNode(), index + 1, newPoint);
      var children = parentNode.children;
      zTreeObj.selectNode(children[index + 1]);
      currentSelectedNode = children[index + 1];
    } else if (currentSelectedNode.type === 'MOVE') {
      var addNodes = zTreeObj.addNodes(currentSelectedNode, 0, newPoint);
      zTreeObj.selectNode(addNodes[0]);
      currentSelectedNode = addNodes[0];
    }
  }
  common.saveZNodesToLocalStorage();
});
