let activeOrdersList = [];
const activeOrders = document.querySelector('.activeContainer');
const completedOrders = document.querySelector('.completedContainer');

let orderExpiry = 60;

socket.on('new order', function({orderID, orderDesc, orderStatus}) {
    // Display order number to customer.
    console.log(orderID + orderDesc + orderStatus);
    activeOrders.innerHTML += `<p id="active-${orderID}">${orderID}</p>`;
    activeOrdersList.push(orderID);
});

socket.on('delete order', function() {
    // Move order number to completed side. Delete after a set number of seconds.
    let orderID = activeOrdersList.shift();
    document.getElementById(`active-${orderID}`).remove();
    completedOrders.innerHTML += `<p id="completed-${orderID}">${orderID}</p>`;
    setTimeout(function() {
        document.getElementById(`completed-${orderID}`).remove();
    }, (1000*orderExpiry));
});