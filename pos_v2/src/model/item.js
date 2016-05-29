function Item(barcode, name, unit, price) {
    this.barcode = barcode;
    this.name = name;
    this.unit = unit;
    this.price = price || 0.00;
}

function CartItem(barcode, name, unit, price, count) {
    this.barcode = barcode;
    this.name = name;
    this.unit = unit;
    this.price = price || 0.00;
    this.count = count || 0;
}