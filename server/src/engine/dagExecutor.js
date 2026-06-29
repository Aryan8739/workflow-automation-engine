function dagExecutor(workflow) {
  const { nodes = [], edges = [] } = workflow;
  
  const inDegree = new Map();
  const adjacencyList = new Map();
  
  // Initialize graphs
  nodes.forEach(node => {
    inDegree.set(node.id, 0);
    adjacencyList.set(node.id, []);
  });

  // Populate graph from edges
  edges.forEach(edge => {
    const { source, target } = edge;
    if (inDegree.has(target)) {
      inDegree.set(target, inDegree.get(target) + 1);
    }
    if (adjacencyList.has(source)) {
      adjacencyList.get(source).push(target);
    }
  });

  // Kahn's algorithm
  const queue = [];
  inDegree.forEach((degree, nodeId) => {
    if (degree === 0) {
      queue.push(nodeId);
    }
  });

  const sortedNodeIds = [];

  while (queue.length > 0) {
    const current = queue.shift();
    sortedNodeIds.push(current);

    const neighbors = adjacencyList.get(current) || [];
    for (const neighbor of neighbors) {
      const newDegree = inDegree.get(neighbor) - 1;
      inDegree.set(neighbor, newDegree);
      if (newDegree === 0) {
        queue.push(neighbor);
      }
    }
  }

  if (sortedNodeIds.length !== nodes.length) {
    throw new Error('Cycle detected in workflow DAG. Cannot execute.');
  }

  return sortedNodeIds;
}

export default dagExecutor;
