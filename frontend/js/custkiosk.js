let order = [];
let orderTotal = 0.00;

let media = {'Cheeseburger': 'media/kiosk/menuItems/burgers/cheeseburger.png',
    'Stack Burger': 'media/kiosk/menuItems/burgers/double-burger.png',
    'Chicken Nuggets': 'media/kiosk/menuItems/chicken/chickennugget.png',
    'Chicken Burger': 'media/kiosk/menuItems/chicken/chicken-burger.png',
    'Chicken Wrap': 'media/kiosk/menuItems/wraps/ranch-chicken-wrap.png'};

function addToOrder(item) {
    let orderIndex = -1;
    for (let i = 0; i < order.length; i++) {
        if (order[i].desc === item.desc) {
            orderIndex = i;
            break;
        }
    }
    if (orderIndex !== -1) {
        increaseQty(order[orderIndex].id);
    } else {
        const entryID = `item-${order.length}`;
        const itemImgUrl = media[item.desc];
        const basketItem = `
            <div id="${entryID}" class="orderEntry">
              <img src="${itemImgUrl}">
              <div class="entryDetails">
                <p class="entryDesc">${item.desc}</p>
                <p class="entryPrice">£${item.price}</p>
                <div class="entryQty">
                  <button class="qtyDecrease" onclick="decreaseQty('${entryID}')">-</button>
                  <p id="qty-${entryID}">1</p>
                  <button class="qtyIncrease" onclick="increaseQty('${entryID}')">+</button>
                </div>
              </div>
            </div>
            <hr id="hr-${entryID}">
            `;

        if (order.length === 0) {
            document.getElementsByClassName('basket')[0].style.display = 'block';
        }

        order.push({id: entryID, desc: item.desc, price: item.price, qty: 1});
        orderTotal += item.price;

        document.getElementById('basketQty').innerHTML++;

        document.getElementsByClassName('basketContainer')[0].innerHTML += basketItem;
        document.getElementById('grandTotal').innerHTML = '£' + orderTotal.toFixed(2);
    }
}

function increaseQty(entryID) {
    let orderIndex = -1;
    for (let i = 0; i < order.length; i++) {
        if (order[i].id === entryID) {
            orderIndex = i;
            break;
        }
    }
    if (orderIndex !== -1) {
        let unitPrice = order[orderIndex].price / order[orderIndex].qty;
        order[orderIndex].qty++;
        order[orderIndex].price = unitPrice * order[orderIndex].qty;
        orderTotal += unitPrice;

        document.getElementById('grandTotal').innerHTML = '£' + orderTotal.toFixed(2);
        document.getElementById(`qty-${entryID}`).innerHTML++;

        document.getElementById('basketQty').innerHTML++;
    }
}

function decreaseQty(entryID) {
    let orderIndex = -1;
    for (let i = 0; i < order.length; i++) {
        if (order[i].id === entryID) {
            orderIndex = i;
            break;
        }
    }
    if (orderIndex !== -1) {
        if (order[orderIndex].qty === 1) {
            let totalSubunitCost = order[orderIndex].price * order[orderIndex].qty;
            orderTotal -= totalSubunitCost;
            document.getElementById(entryID).remove();
            document.getElementById(`hr-${entryID}`).remove();
            document.getElementById('grandTotal').innerHTML = '£' + orderTotal.toFixed(2);
            document.getElementById('basketQty').innerHTML--;
            order.splice(orderIndex, 1);
            if (order.length === 0) {
                document.getElementsByClassName('basket')[0].style.display = 'none';
            }
        } else {
            let unitPrice = order[orderIndex].price / order[orderIndex].qty;
            order[orderIndex].qty--;
            order[orderIndex].price = unitPrice * order[orderIndex].qty;
            orderTotal -= unitPrice;

            document.getElementById('grandTotal').innerHTML = '£' + orderTotal.toFixed(2);
            document.getElementById(`qty-${entryID}`).innerHTML--;
            document.getElementById('basketQty').innerHTML--;
        }
    }
}

function completeOrder() {

}

document.getElementById('item-cheeseburger').onclick = function() {
    addToOrder({desc: 'Cheeseburger', price: 2.49});
}

document.getElementById('item-stackburger').onclick = function() {
    addToOrder({desc: 'Stack Burger', price: 2.99});
}

document.getElementById('item-chknug').onclick = function() {
    addToOrder({desc: 'Chicken Nuggets', price: 1.49});
}

document.getElementById('item-chkburger').onclick = function() {
    addToOrder({desc: 'Chicken Burger', price: 2.49});
}

document.getElementById('item-chkwrap').onclick = function() {
    addToOrder({desc: 'Chicken Wrap', price: 1.99});
}

document.getElementById('orderPymtBtn').onclick = function() {
    completeOrder();
}