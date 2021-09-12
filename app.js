let computers = []
let pay = 0
let bankBalance = 0
let outstandingLoan = 0
let loanCount = 0
let laptopsBought = 0
let computerSelected = 0
const selectElement = document.getElementById("laptoplist")

//event listener for when a computer is changed in the Select element
selectElement.addEventListener("change", updateLaptopView);

//fetching computer objects from the computers API, places them in an array
fetch("https://noroff-komputer-store-api.herokuapp.com/computers")
    .then(response => response.json())
    .then(data => computers = data)
    .then(() => {
        populateSelect()
        refreshValues()
        updateLaptopView()

    })


//populates the select with titles of the computers
function populateSelect() {
    var selectBox = document.getElementById("laptoplist")
    for (var i = 0; i < computers.length; i++) {
        var option = document.createElement("option")
        option.text = computers[i].title
        option.value = computers[i].id
        selectBox.appendChild(option)
    }

}

//hides and reveals elements
function toggleVisibility(elementToToggle) {

    const x = document.getElementById(elementToToggle);
    console.log(x.style.visibility, elementToToggle)
    if (x.style.visibility === "hidden") {
        x.style.visibility = "visible";
    } else {
        x.style.visibility = "hidden";
    }
    console.log(x.style.visibility, elementToToggle)
}


// refresh all numbers on page
function refreshValues() {
    document.getElementById("pay").innerHTML = pay
    document.getElementById("balance").innerHTML = bankBalance
    document.getElementById("outstandingLoan").innerHTML = outstandingLoan
}

//activates when Loan button is pressed. reacts accordingly.
function takeLoan() {
    loanSum = 0
    //Loan must be paid back before getting another!
    //only one loan before buying computer
    if (outstandingLoan > 0) {
        alert("You already have an unpaid loan")
    } else if (loanCount > laptopsBought) {
        alert("You can't take another loan until you've used it to buy something")
    } else {
        //prompt popup box asking how much
        loanSum = prompt("State the size of the loan you want. Maximum amount allowed is " + bankBalance / 2 + "€");
        //max loan = balance/2
        if (loanSum > (bankBalance / 2) || loanSum < 1) {
            alert("Invalid sum")
        } else {
            loanCount++
            outstandingLoan = loanSum
            //unary helps...
            bankBalance = +bankBalance + +loanSum
            toggleVisibility("loan")
            toggleVisibility("loanTitle")
            toggleVisibility("outstandingLoan")
            toggleVisibility("repay")
        }
    }
    refreshValues()
}

//put pay into bank. prompts loan deductions when needed.
function bankMoney() {
    bankBool = true
    if (outstandingLoan > 0) {
        bankBool = confirm("to use your bank, you must first put 10% of your pay to deduct your loan (" + pay / 10 + ")")
        if (bankBool) {
            bankSum = pay / 10

            if (outstandingLoan > bankSum) {
                outstandingLoan = outstandingLoan - bankSum
                pay = pay - bankSum
                bankSum = 0
            } else {
                bankSum = bankSum - outstandingLoan
                pay = pay - bankSum
                outstandingLoan = 0
            }
            if (outstandingLoan == 0) {

                toggleVisibility("outstandingLoan")
                toggleVisibility("repay")
                toggleVisibility("loanTitle")
                toggleVisibility("loan")
            }
        }
    }
    if (bankBool) {
        bankBalance = bankBalance + pay
        pay = 0

    }
    refreshValues();
}

//add money to pay
function work() {

    pay = pay + 100
    refreshValues()
}

//uses pay to cut loan. if loan gets paid, reacts accordingly
function repayLoan() {
    if (outstandingLoan > pay) {
        outstandingLoan = outstandingLoan - pay
        pay = 0
    } else {
        pay = pay - outstandingLoan
        outstandingLoan = 0
    }

    if (outstandingLoan == 0) {

        toggleVisibility("outstandingLoan")
        toggleVisibility("loanTitle")
        toggleVisibility("repay")
        toggleVisibility("loan")
    }
    refreshValues();
}

//when a laptop computer is chosen, updates all the information related to that computer into the html
function updateLaptopView() {

    const selectCheck = document.getElementById("laptoplist")
    computerSelected = selectCheck.value
    const lapTop = computers[computerSelected - 1]
    //description

    document.getElementById("description").innerHTML = lapTop.description
    //specs
    let specString = ""
    for (let i = 0; i < lapTop.specs.length; i++) {
        specString += lapTop.specs[i] + "\n"
    }
    document.getElementById("specs").innerHTML = specString

    //price
    document.getElementById("price").innerHTML = lapTop.price
    //image
    let imageurl = "https://noroff-komputer-store-api.herokuapp.com/" + lapTop.image
    document.getElementById("laptopimage").src = imageurl
}

//returns placeholder image to any event failing to find image
function imgNotFound(event) {
    const source = event.srcElement
    source.src = "imagefail.png"
}

//attempts to buy a laptop computer
function buyLaptop() {
    const lapTop = computers[computerSelected - 1]
    if (lapTop.price > bankBalance) {
        alert("You cannot afford this laptop")
    }
    else {
        bankBalance -= lapTop.price
        laptopsBought++
        refreshValues()
        alert("Congratulations on buying the " + lapTop.title)
    }

}
