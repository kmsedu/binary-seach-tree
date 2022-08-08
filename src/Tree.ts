import {Node} from './Node';

export class Tree {
  public root: Node | null = null;

  public buildTree(
    array: Array<number>,
    start: number,
    end: number
  ): Node | null {
    if (start > end) return null;
    const mid = Math.trunc((start + end) / 2);
    const root = new Node(array[mid]);

    root.left = this.buildTree(array, start, mid - 1);
    root.right = this.buildTree(array, mid + 1, end);

    return (this.root = root);
  }

  private attachNode(key: number, root: Node | null): Node | void {
    if (root === null) return (this.root = new Node(key));

    if (key < root.data) {
      if (root.left === null) {
        root.left = new Node(key);
      } else {
        this.attachNode(key, root.left);
      }
    } else {
      if (root.right === null) {
        root.right = new Node(key);
      } else {
        this.attachNode(key, root.right);
      }
    }
  }

  public insert(key: number) {
    this.attachNode(key, this.root);
  }

  private removeNode(node: Node | null) {
    if (node === null) throw Error('Invalid node parameter.');

    if (node.left !== null && node.right !== null) {
      const successor: Node | null = this.inorderSuccessor(node.right);
      node.data = successor.data;
      node.right = this.delete(successor.data, node.right);
    } else {
      const newNode = node.left || node.right;
      node = newNode;
    }
    return node;
  }

  private inorderSuccessor(node: Node | null) {
    if (node === null) throw Error('Invalid node.');

    let current = node;
    while (current.left) {
      current = current.left;
    }

    return current;
  }

  public delete(key: number, root: Node | null = this.root) {
    if (root === null) return root;

    if (root.data === key) {
      root = this.removeNode(root);
    } else if (key > root.data) {
      root.right = this.delete(key, root.right);
    } else {
      root.left = this.delete(key, root.left);
    }

    return root;
  }

  public find(key: number, root: Node | null = this.root): Node {
    if (root === null) throw Error('Item not in the tree.');
    if (root.data === key) return root;

    return key > root.data
      ? this.find(key, root.right)
      : this.find(key, root.left);
  }

  public levelOrder(
    root: Node | null,
    callback?: Function
  ): Array<number> | void {
    if (root === null) throw Error('Invalid root parameter.');

    const queue = [root];
    const returnArray = [];

    while (queue.length > 0) {
      const node: Node = queue.shift()!;
      if (node.left !== null) queue.push(node.left);
      if (node.right !== null) queue.push(node.right);
      callback ? callback(node) : returnArray.push(node.data);
    }

    if (!callback) return returnArray;
  }

  public inorder(root: Node | null, callback?: Function): number[] | void {
    if (root === null) throw Error('Invalid root parameter.');

    const arr: number[] = [];

    const traverse = (node: Node | null, callback?: Function) => {
      if (node) {
        callback ? traverse(node.left, callback) : traverse(node.left);
        callback ? callback(node) : arr.push(node.data);
        callback ? traverse(node.right, callback) : traverse(node.right);
      }
    };

    callback ? traverse(root, callback) : traverse(root);
    if (!callback) return arr;
  }

  public preorder(root: Node | null, callback?: Function): number[] | void {
    if (root === null) throw Error('Invalid root parameter.');

    const arr: number[] = [];

    const traverse = (node: Node | null, callback?: Function) => {
      if (node) {
        callback ? callback(node) : arr.push(node.data);
        callback ? traverse(node.left, callback) : traverse(node.left);
        callback ? traverse(node.right, callback) : traverse(node.right);
      }
    };

    callback ? traverse(root, callback) : traverse(root);
    if (!callback) return arr;
  }

  public postorder(root: Node | null, callback?: Function): number[] | void {
    if (root === null) throw Error('Invalid root parameter.');

    const arr: number[] = [];

    const traverse = (node: Node | null, callback?: Function) => {
      if (node) {
        callback ? traverse(node.left, callback) : traverse(node.left);
        callback ? traverse(node.right, callback) : traverse(node.right);
        callback ? callback(node) : arr.push(node.data);
      }
    };

    callback ? traverse(root, callback) : traverse(root);
    if (!callback) return arr;
  }

  public height(node: Node | null) {
    if (node === null) return 0;

    const leftHeight: number = this.height(node.left);
    const rightHeight: number = this.height(node.right);

    if (leftHeight - rightHeight > 1) {
      return -1;
    }

    return Math.max(leftHeight, rightHeight) + 1;
  }

  public depth(root: Node | null = this.root, node: Node | null): number {
    if (node === null) throw Error('Invalid search parameter.');
    if (root === null) return -1;
    let distance = -1;

    if (root.data === node.data) return distance + 1;

    distance = this.depth(root.left, node);
    if (distance >= 0) return distance + 1;
    distance = this.depth(root.right, node);
    if (distance >= 0) return distance + 1;

    return distance;
  }

  private checkBalance(node: Node | null) {
    if (node === null) return 0;

    const leftHeight: number = this.checkBalance(node.left);
    if (leftHeight === -1) return -1;

    const rightHeight: number = this.checkBalance(node.right);
    if (rightHeight === -1) return -1;

    if (Math.abs(leftHeight - rightHeight) > 1) {
      return -1;
    } else {
      return 1 + Math.max(leftHeight, rightHeight);
    }
  }

  public isBalanced(node: Node | null) {
    return this.checkBalance(node) !== -1;
  }

  public rebalance(root: Node | null): void {
    const arr: number[] = [];
    const traverse = (root: Node | null) => {
      if (root === null) return;
      traverse(root.left);
      arr.push(root.data);
      traverse(root.right);
    };
    traverse(root);
    this.root = this.buildTree(arr, 0, arr.length - 1);
  }

  public prettyPrint(
    node: Node | null = this.root,
    prefix = '',
    isLeft = true
  ) {
    if (node!.right) {
      this.prettyPrint(
        node!.right,
        `${prefix}${isLeft ? '|   ' : '    '}`,
        false
      );
    }
    console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node!.data}`);
    if (node!.left) {
      this.prettyPrint(
        node!.left,
        `${prefix}${isLeft ? '    ' : '|   '}`,
        true
      );
    }
  }

  public treePrint(node: Node | null) {
    if (node !== null) {
      const p = (s: string, t: string, n: number, l: number) =>
        (Array(l + 1).join(s) + Array(n + 1).join(t)).slice(0, n);
      for (let i = 9; i > 0; i--) {
        console.log(
          `\x1b[32m ${p(' ', '*', 9, i)}${p('*', ' ', 9, 9 - i - 1)} \x1b[0m`
        );
      }
      for (let i = 0; i < 2; i++) {
        console.log(
          `\x1b[31m ${p(' ', '*', 9, 7)}${p('*', ' ', 9, 2)} \x1b[0m`
        );
      }
    }
  }
}

/* For node.js testing */

const emptyTree = new Tree();
const arr = [
  23, 8, 27, 35, 30, 15, 21, 6, 25, 1, 31, 9, 3, 4, 19, 24, 2, 12, 17, 20, 14,
  11, 26, 13, 22, 33, 29, 18, 28, 34, 32, 16, 5, 7, 10,
].sort((a, b) => a - b);

console.log(arr);

emptyTree.buildTree(arr, 0, arr.length - 1);

emptyTree.prettyPrint(emptyTree.root);

console.log(emptyTree.height(emptyTree.find(4)));

console.log(emptyTree.depth(emptyTree.root, emptyTree.find(8)));

console.log(emptyTree.isBalanced(emptyTree.root));

emptyTree.insert(100);
emptyTree.insert(101);
emptyTree.insert(102);
emptyTree.insert(103);
emptyTree.insert(104);

emptyTree.prettyPrint();

console.log(emptyTree.isBalanced(emptyTree.root));

emptyTree.rebalance(emptyTree.root);

emptyTree.prettyPrint();
