// Created by szatpig at 2019/12/13.

let nodeList = [];

// 搜索框回车事件响应
const searchTree = (value:string,departListTree:any) => {
    // 把树形结构还原成搜索以前的。
    nodeList = JSON.parse(JSON.stringify(departListTree));
    if (value == "") {
        return nodeList;
    }
    if (nodeList && nodeList.length > 0) {
        nodeList.forEach((n:any,i:number,a:any)=>{
            searchChildrenTree(n, value);
        });

        // 没有叶子节点的根节点也要清理掉
        let length = nodeList.length;
        for (let i = length - 1; i >= 0; i--) {
            let _node = nodeList[i];
            if (!isHasChildren(_node) && _node.title.indexOf(value) <= -1) {
                nodeList.splice(i, 1);
            }
        }
    }
    return nodeList
}

const searchChildrenTree = (node:any, value:string) =>{
    let depth = getTreeDepth(node);
    for (let i = 0; i < depth - 1; i++) {
        // 记录【删除不匹配搜索内容的叶子节点】操作的次数。
        // 如果这个变量记录的操作次数为0，表示树形结构中，所有的
        // 叶子节点(不包含只有根节点的情况)都匹配搜索内容。那么就没有必要再
        // 在循环体里面遍历树了.
        let spliceCounter = 0;

        // 遍历树形结构
        traverseTree(node, (n:any) =>{
            if (isHasChildren(n)) {
                let children = n.children;
                let length = children.length;

                // 找到不匹配搜索内容的叶子节点并删除。为了避免要删除的元素在数组中的索引改变，从后向前循环,
                // 找到匹配的元素就删除。
                for (let j = length - 1; j >= 0; j--) {
                    let e3 = children[j];
                    if (!isHasChildren(e3) && e3.title.indexOf(value) <= -1) {
                        children.splice(j,1);
                        spliceCounter++;
                    }
                } // end for (let j = length - 1; j >= 0; j--)
            }
        }); // end this.traverseTree(node, n=>{

        // 所有的叶子节点都匹配搜索内容，没必要再执行循环体了。
        if (spliceCounter == 0) {
            break;
        }
    }
}

// 判断树形结构中的一个节点是否具有孩子节点
const isHasChildren = (node:any) =>{
    let flag = false;
    if (node.children && node.children.length > 0) {
        flag = true;
    }
    return flag;
}

// 通过传入根节点获得树的深度，是 calDepth 的调用者。
const getTreeDepth = (node:any) => {
    if (undefined == node || null == node) {
        return 0;
    }
    // 返回结果
    let r = 0;
    // 树中当前层节点的集合。
    let currentLevelNodes = [node];
    // 判断当前层是否有节点
    while(currentLevelNodes.length > 0){
        // 当前层有节点，深度可以加一。
        r++;
        // 下一层节点的集合。
        let nextLevelNodes = new Array();
        // 找到树中所有的下一层节点，并把这些节点放到 nextLevelNodes 中。
        for(let i = 0; i < currentLevelNodes.length; i++) {
            let e = currentLevelNodes[i];
            if (isHasChildren(e)) {
                nextLevelNodes = nextLevelNodes.concat(e.children);
            }
        }
        // 令当前层节点集合的引用指向下一层节点的集合。
        currentLevelNodes = nextLevelNodes;
    }
    return r;
}

// 非递归遍历树
const traverseTree = (node:any, callback:any) =>{
    if (!node) {
        return;
    }
    let stack = [];
    stack.push(node);
    let tmpNode;
    while (stack.length > 0) {
        tmpNode = stack.pop();
        callback(tmpNode);
        if (tmpNode.children && tmpNode.children.length > 0) {
            for (let i:number = tmpNode.children.length - 1; i >= 0; i--) {
                stack.push(tmpNode.children[i]);
            }
        }
    }
}


export default searchTree
