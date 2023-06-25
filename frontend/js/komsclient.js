function clock() {
    const today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds();
    h = checkTime(h);
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('currTime').innerHTML =  h + ":" + m + ":" + s;
    setTimeout(clock, 1000);

    function checkTime(i) {
        if (i < 10) {i = "0" + i;}  // add zero in front of numbers < 10
        return i;
    }
}

function isOverflown(element) {
    return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}

function flagPendingOrders() {
    const pendingLabel = document.getElementById('pendingOrders');
    pendingLabel.style.backgroundColor = '#FFFFFF';
    pendingLabel.style.color = '#000000';
    pendingLabel.style.fontWeight = 'bold';
}

function startTimer(orderID) {
    let c = 0
    setInterval(function() {
        if (document.getElementById(`time-${orderID}`) == null) {
            // This automatically stops the timer.
        } else {
            document.getElementById(`time-${orderID}`).innerHTML = c;
            c++;
            if (c >= targetOrderTime + 2) {
                document.getElementById(`order-${orderID}`).style.border = '3px solid red';
                document.getElementById(`order-${orderID}`)
                    .getElementsByClassName('orderStatus')[0].style.backgroundColor = 'red';
            }
        }
    }, 1000);
}

let totalOrders = 0;
let totalTimes = 0;
let avgTime = 0;
let maxTime = 0;

// Global variables
let targetOrderTime = 30;
let laneNumber = 1;
let laneStatus = 'ON';
let zoom = 2;

const currentOrders = document.querySelector('.ordersBacker');
let activeOrders = [];
let overflowingOrders = 0;

const addNewOrder = ({orderID, orderDesc, orderStatus}) => {
    const today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    m = checkTime(m);
    function checkTime(i) {
        if (i < 10) {i = "0" + i;}  // add zero in front of numbers < 10
        return i;
    }
    const formattedTime = h + ":" + m;

    const newOrder = `
        <div class="orderCard" id="order-${orderID}">
          <div class="orderID">
            <p>${orderID}</p>
          </div>
          <div class="orderBody">
            <p>${orderDesc}</p>
          </div>
          <div class="orderStatus">
            <p id="status-${orderID}">${orderStatus}</p>
            <p id="time-${orderID}">0</p>
          </div>
        </div>
    `;

    currentOrders.innerHTML += newOrder;
    activeOrders.push(orderID);
    startTimer(orderID);

    if (isOverflown(currentOrders)) {
        overflowingOrders += 1;
        document.getElementById(`order-${orderID}`).style.display = 'none';
        document.getElementById('pendingOrders').innerHTML = overflowingOrders + ' pending...';
        flagPendingOrders();
    }

    var notif = new Audio('../media/neworder.mp3');
    notif.play();
}

socket.on('new order', function({orderID, orderDesc, orderStatus}) {
    addNewOrder({orderID, orderDesc, orderStatus});
});

socket.on('delete order', function() {
    if (activeOrders.length > 0) {
        const orderID = activeOrders.shift();
        if (activeOrders.length >= 2) {
            if (document.getElementById(`order-${activeOrders[1]}`).style.display === 'none') {
                document.getElementById(`order-${activeOrders[1]}`).style.display = 'block';
            }
        }
        const pendingLabel = document.getElementById('pendingOrders');
        const orderTime = parseInt(document.getElementById(`time-${orderID}`).innerHTML);
        totalTimes += orderTime;
        totalOrders++;
        if (totalOrders === 0) {
            avgTime = totalTimes;
        } else {
            avgTime = Math.ceil(totalTimes / totalOrders);
        }
        if (orderTime > maxTime) {
            maxTime = orderTime;
        }
        document.getElementById('laneDesc').innerHTML = `Lane ${laneNumber} - ${laneStatus} - ${avgTime}/${maxTime}`;
        document.getElementById(`order-${orderID}`).remove();
        if (overflowingOrders > 0) {
            overflowingOrders -= 1;
            document.getElementById('pendingOrders').innerHTML = overflowingOrders + ' pending...';
            if (overflowingOrders === 0) {
                pendingLabel.style.backgroundColor = '#000000';
                pendingLabel.style.color = '#FFFFFF';
                pendingLabel.style.fontWeight = 'normal';
            }
        }
    } else {
        console.log('No more orders to pop.');
    }
});


// On KOMS load, call the following:
clock();
document.getElementById('laneDesc').innerHTML = `Lane ${laneNumber} - ${laneStatus} - ${avgTime}/${maxTime}`;
document.addEventListener('keyup', event => {
   if (event.code === 'Space') {
       socket.emit('delete order')
   } else if (event.code === 'KeyQ') {
       const navMenu = document.getElementsByClassName('komsNav')[0];
       if (navMenu.style.display === 'none') {
           navMenu.style.display = 'block';
       } else {
           navMenu.style.display = 'none';
       }
   } else if (event.code === 'KeyC') {
       window.open('/drv.html', 'Driver',
           "resizable=no, toolbar=no, scrollbars=no, menubar=no, status=no, directories=no, width=400, height=300");
   } else if (event.code === 'KeyV') {
       if (document.body.style.fontSize === '24px') {
           document.body.style.fontSize = 'unset';
       } else {
           document.body.style.fontSize = '24px';
       }
   }
});