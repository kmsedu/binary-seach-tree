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

    this.root = root;
    return root;
  }

  private attachNode(key: number, root: Node | null): Node | void {
    if (root === null) {
      return (this.root = new Node(key));
    }

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

  public find(key: number, root: Node | null = this.root): Node | void {
    if (root === null) throw Error('Item not in the tree.');
    if (root.data === key) return root;

    return key > root.data
      ? this.find(key, root.right)
      : this.find(key, root.left);
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
emptyTree.buildTree([9, 2, 3, 5, 4, 6, 7, 1].sort(), 0, 7);
emptyTree.prettyPrint(emptyTree.root);
emptyTree.delete(6, emptyTree.root);
emptyTree.prettyPrint(emptyTree.root);
emptyTree.delete(4, emptyTree.root);
emptyTree.prettyPrint(emptyTree.root);
emptyTree.treePrint(emptyTree.root);
console.log(emptyTree.find(1));
