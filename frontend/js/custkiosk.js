let order = [];
let orderTotal = 0.00;

let dispatchedOrderID = 1;

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
        const itemImgUrl = item.image;
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
    let htmlOrderRequest = "";
    for (let i = 0; i < order.length; i++) {
        let line = `<p>${order[i].qty} ${order[i].desc}</p>`
        htmlOrderRequest += line;
    }
    socket.emit('new order', {
        orderID: dispatchedOrderID,
        orderDesc: htmlOrderRequest,
        orderStatus: 'Paid'
    });
    dispatchedOrderID++;
    console.log(`Dispatched Order No. ${dispatchedOrderID - 1}`);
    order = [];
    orderTotal = 0.00;
    document.getElementsByClassName('basketContainer')[0].innerHTML = "";
    document.getElementById('basketQty').innerHTML = '0';
    document.getElementById('grandTotal').innerHTML = '£' + orderTotal.toFixed(2);
    document.getElementsByClassName('basket')[0].style.display = 'none';
}

function showCategory(cat) {
    document.getElementById(cat).style.display = 'flex';
    document.getElementById('popularItems').style.display = 'none';
    document.getElementById('menuCat').style.display = 'none';
    document.getElementById('kioskTitle').style.display = 'none';
}

function hideCategory(cat) {
    document.getElementById(cat).style.display = 'none';
    document.getElementById('popularItems').style.display = 'flex';
    document.getElementById('menuCat').style.display = 'flex';
    document.getElementById('kioskTitle').style.display = 'block';
}