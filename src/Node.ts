export class Node {
  data: number;
  left: Node | null;
  right: Node | null;

  constructor(
    data: number,
    left: Node | null = null,
    right: Node | null = null
  ) {
    this.data = data;
    this.left = left;
    this.right = right;
  }
}
