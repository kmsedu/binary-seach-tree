/**
 * Implementation of simple Binary Tree node, containing a single number as data,
 * and pointers to it's left and right children.
 */

export class Node {
  constructor(
    public data: number,
    public left: Node | null = null,
    public right: Node | null = null
  ) {}
}
