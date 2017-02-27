var userSelectedSeats = [];
var theatreRow = 10;
var theatreColumn = 10; //max 26 as i using asci code
var filledSeats = [];

var selectedSeats = [];
function refreshSeats(){
  if(typeof(Storage) !== "undefined"){
	  if(JSON.parse(localStorage.getItem("bookTheatreSeats"))){
		selectedSeats = JSON.parse(localStorage.getItem("bookTheatreSeats"));
	  }
  }
}
refreshSeats();
function findFilledSeats(){
  for(var i=0;i<selectedSeats.length;i++){
    if(selectedSeats[i].tickets){
      for(var j=0;j<selectedSeats[i].tickets.length;j++){
        filledSeats.push(selectedSeats[i].tickets[j]);
      }
    }
  }
}

findFilledSeats();

function findSeatAvailable(seatRow, seatColumn){
  var found = false;
  for(var i=0;i<filledSeats.length;i++){
    if(filledSeats[i].row == seatRow && filledSeats[i].column == seatColumn){
      found = true;
      return found;
    }
  }
  return found;
}

function renderTheatreSeat() {
    var elements = "";
    var rowElements = "";

    findFilledSeats();
    for (var i = 0; i <= theatreRow; i++) {
        rowElements = "";
        for (var j = 0; j <= theatreColumn; j++) {
            var val = '&nbsp;';
            if (i == 0) {
                if (j != 0) {
                    val = j;
                }
            } else {
                if (j == 0) {
                    val = String.fromCharCode(65 + (i - 1));
                }
            }

            var seatNotAvailableClass = "";
            var seatAvailable = true;
            if(findSeatAvailable(i,j)){
              seatNotAvailableClass = "selected-order-user";
              seatAvailable = false;
              val = "";
            }
            if (i == 0 || j == 0 || !seatAvailable) {
                rowElements += "<div class='column-elements no-border font-bold "+seatNotAvailableClass+"'>" + val + "</div>";
            } else {
                rowElements += "<div onclick='seatSelected(" + i + "," + j + ", event)' class='column-elements'></div>";
            }
        }
        elements += "<div class='row-elements'>" + rowElements + "</div>";
    }
    document.getElementById('seatAvailable').innerHTML = '';
    document.getElementById('seatAvailable').innerHTML = elements;
}

function checkname() {
    var element = document.getElementById("username");
    if (element.value.length > 0) {
        return true;
    }
    return false;
}

function hidePage(value) {
    switch (value) {
        case 1:
            document.getElementById("userInfo").style.display = 'none';
            break;
        case 2:
            document.getElementById("theatreRoom").style.display = 'none';
            break;
        case 3:
            document.getElementById("ticketSelectedRoom").style.display = 'none';
            break;
        default: break;
    }
}

function showPage(value) {
    switch (value) {
        case 1:
            document.getElementById("userInfo").style.display = 'block';
            break;
        case 2:
            document.getElementById("theatreRoom").style.display = 'block';
            break;
        case 3:
            document.getElementById("ticketSelectedRoom").style.display = 'block';
            break;
    }
}

function saveUserSeat() {
    var x = document.getElementById("seatscount").value;
    var seatAvailableCount = (theatreRow * theatreColumn) - filledSeats.length;

    if (!checkname() || x == 0 || seatAvailableCount < x) {
        var message = "Please fill all information";
        if(seatAvailableCount < x){
          message = "Number of seats available is "+seatAvailableCount;
        }
        document.getElementById("userErrorMessage").innerHTML = message;
    } else {
        hidePage(1);
        hidePage(3);
        showPage(2);
        renderTheatreSeat();
    }
	userSelectedSeats = []
    document.getElementById('userErrorMessage').innerHTML = "";
}

function seatSelected(row, column, event) {
    var className = event.target.className;
    var seatSelected = "chosen-seat";
    var dataFound = false;
    var x = document.getElementById("seatscount");

    if (userSelectedSeats.length > 0) {
        for (var i = 0; i < userSelectedSeats.length; i++) {
            if (userSelectedSeats[i].row == row && userSelectedSeats[i].column == column) {
                dataFound = true;
                userSelectedSeats.splice(i, 1);
                var newCLass = className.replace(seatSelected, "");
                event.target.setAttribute('class', newCLass);
                return false;
            }
        }
    }
    if (userSelectedSeats.length < x.value) {
        if (dataFound == false) {
            userSelectedSeats.push({
                row: row,
                column: column
            });
            event.target.setAttribute('class', className + " " + seatSelected);
        }
    }
}

function bookSeat() {
    var seatCount = document.getElementById("seatscount").value;
    var element = document.getElementById("username");

    if (seatCount != userSelectedSeats.length) {
        document.getElementById("seatErrorMessage").innerHTML = "You have selected " + userSelectedSeats.length + " seats out of "+ seatCount;
    } else {
        selectedSeats.push({'name': element.value,'tickets':userSelectedSeats});
        localStorage.setItem("bookTheatreSeats", JSON.stringify(selectedSeats));

        hidePage(1);
        hidePage(2);
        showPage(3);
        finish();
    }
}

function finish(){
    document.getElementById('seatErrorMessage').innerHTML = "";
    var element = document.getElementById('reservedSeats');
    var data = "";
    data = "<div class='font-bold full-width box-sizing-box display-inline-block f-left'><div class='padding-small width-25 box-sizing-box display-inline-block f-left'>Name</div><div class='width-25 padding-small box-sizing-box display-inline-block f-left'>No. of seats</div><div class='width-50 box-sizing-box display-inline-block f-left padding-small'>Seats</div></div>";
    for(var i=0;i<selectedSeats.length;i++){
      var ticketsData = [];
      for(var j=0;j<selectedSeats[i].tickets.length;j++){
        ticketsData.push(String.fromCharCode(64 + selectedSeats[i].tickets[j].row)+""+selectedSeats[i].tickets[j].column);
      }
      ticketsData.toString();
      data += "<div class='full-width box-sizing-box display-inline-block f-left'><div class='padding-small width-25 box-sizing-box display-inline-block f-left'>"+selectedSeats[i].name+"</div><div class='width-25 padding-small box-sizing-box display-inline-block f-left'>"+selectedSeats[i].tickets.length+"</div><div class='width-50 box-sizing-box display-inline-block f-left padding-small'>"+ticketsData+"</div></div>";
    }
    element.innerHTML = data;
    refreshSeats();
}
