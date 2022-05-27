export class Cart {
  cart;
  keys;
  constructor() {
    this.cart = {}; // 상품이 들어간다.
    this.keys = new Set(); // 상품의 key 가 들어간다.
  }

  getBefore(){
    const localCart = JSON.parse(localStorage.getItem('cart'))
    if(!localCart){
      return;
    }
    localCart.forEach((item) => {
      this.add(item)
    });
  }

  add(item) {
    if (this.has(item.id)) {
      return;
    }
    this.cart[item.id] = item;
    this.keys.add(item.id);
  }

  delete(id) {
    this.keys.delete(id);
    delete this.cart[id];
  }

  find(id) {
    return this.cart[id];
  }

  has(id) {
    return this.keys.has(id);
  }

  update(item) {
    if (!this.has(item.id)) {
      return;
    }
    this.cart[item.id] = item;
  }

  all() {
    return this;
  }

  valueOf() {
    // [{}, {}, ...] 형태로 만들어서 반환하거나
    // JSON.stringify 형태로 바꿔서 반환하기
    // { 'a1': 10, 'b2': 100 }
    const values = Object.values(this.cart);

    // return values;
    // OR
    return JSON.stringify(values);
  }
}
