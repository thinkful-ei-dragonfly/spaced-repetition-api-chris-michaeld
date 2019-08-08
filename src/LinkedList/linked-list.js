//Changed node constructor so that all  "item"
// each item is an object of "values"
// can be passed in
class _Node {
  constructor({ value, next }) {
    this.value = value;
    this.next = next;
  }
}

//changed linked list to incorporate all "value"s
// constructor now takes in id, name, tot_score
// ----------------------------------------------
class LinkedList {
  constructor({ id, name, total_score }) {
    this.id = id;
    this.name = name;
    this.total_score = total_score;
    this.head = null;
  }

  // changed insertFirst to put incorrect item{} that need to
  //be correct at head until they are correct

  insertFirst(item) {
    this.head = new _Node({
      item,
      next: this.head
    });
  }

  //same changes as insertFirst
  insertLast(item) {
    if (this.head === null) {
      this.insertFirst(item);
    } else {
      let tempNode = this.head;
      while (tempNode.next !== null) {
        tempNode = tempNode.next;
      }
      tempNode.next = new _Node({ item, next: null });
    }
  }

  //again, node as object
  insertBefore(item, nodeKey) {
    if (!this.head) {
      return null;
    }

    if (this.head.value === item) {
      this.insertFirst(item);
      return;
    }

    //node as obj{}
    let newNode = new _Node({ item, next: null });

    let currNode = this.head;
    let prevNode = this.head;

    while (currNode !== null) {
      prevNode = currNode;
      currNode = currNode.next;

      if (currNode === null) {
        console.log('Item not found');
        return;
      }

      if (currNode.value === nodeKey) {
        prevNode.next = newNode;
        newNode.next = currNode;
        return;
      }
    }
  }

  //does not need change b/c
  //this.insertBefore creates new _Node{}
  insertAt(pos, item) {
    let currNode = this.head;
    for (let i = 0; i < pos; i++) {
      currNode = currNode.next;
    }
    this.insertBefore(item, currNode.value);
  }

  insertAfter(item, nodeKey) {
    if (!this.head) {
      return null;
    }

    if (this.head.value === item) {
      this.insertFirst(item);
      return;
    }

    let newNode = new _Node({ item, next: null });

    let currNode = this.head;

    while (currNode !== null) {
      currNode = currNode.next;

      if (currNode === null) {
        console.log('Item not found');
        return;
      }

      if (currNode.value === nodeKey) {
        newNode.next = currNode.next;
        currNode.next = newNode;
        return;
      }
    }
  }

  //same, new _Node as {}
  insertLastCycle(item, node) {
    if (this.head === null) {
      this.insertFirst(item);
    } else {
      let tempNode = this.head;
      while (tempNode.next !== null) {
        tempNode = tempNode.next;
      }
      tempNode.next = new _Node({ item, node });
      console.log('a string');
    }
  }

  find(item) {
    let currNode = this.head;
    if (!this.head) {
      return null;
    }
    while (currNode.value !== item) {
      if (currNode.next === null) {
        return null;
      } else {
        currNode = currNode.next;
      }
    }
    return currNode;
  }

  remove(item) {
    if (!this.head) {
      return null;
    }
    if (this.head.value === item) {
      this.head = this.head.next;
      return;
    }

    let currNode = this.head;
    let prevNode = this.head;

    while (currNode !== null && currNode.value !== item) {
      prevNode = currNode;
      currNode = currNode.next;
    }
    if (currNode === null) {
      console.log('Item not found');
      return;
    }
    prevNode.next = currNode.next;
    return;
  }

  //displays as LL
  display() {
    let currNode = this.head;
    while (currNode !== null) {
      console.log(currNode.value);
      currNode = currNode.next;
    }
  }

  //add mapList method to show as Arr[]
  mapList(callback) {
    let node = this.head;
    let arr = [];
    while (node) {
      arr.push(callback(node));
      node = node.next;
    }
    return arr;
  }
}

module.exports = { _Node, LinkedList };
