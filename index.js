'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP
//Original Data, this still works fine

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
      "2019-11-18T21:31:17.178Z",
      "2019-12-23T07:42:02.383Z",
      "2020-01-28T09:15:04.904Z",
      "2020-04-01T10:17:24.185Z",
      "2020-05-08T14:11:59.604Z",
      "2020-07-26T17:01:17.194Z",
      "2022-10-05T23:36:17.929Z",
      "2022-10-13T10:51:36.790Z",
    ],

};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
      "2019-11-01T13:15:33.035Z",
      "2019-11-30T09:48:16.867Z",
      "2019-12-25T06:04:23.907Z",
      "2020-01-25T14:18:46.235Z",
      "2020-02-05T16:33:06.386Z",
      "2020-04-10T14:43:26.374Z",
      "2020-06-25T18:49:59.371Z",
      "2022-10-11T12:01:20.894Z",
    ],
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


///Code for the project, do ALL project work in this section:

//code for displaying the Dates
const formatMovementDate = function(date){
  const getDaysPassed = (day1,day2) =>
  Math.round(Math.abs((day2- day1) / (1000 * 60 * 60 * 24)))

  const daysPassed = getDaysPassed(new Date(), date)

  if(daysPassed===0) return `Today`
  if(daysPassed===1) return `Yesterday`
  if(daysPassed <= 7) return `${daysPassed} days ago`

  else{
    const day = date.getDate();
    const month = date.getMonth()+1
    const year = date.getFullYear()
    return `${month}/${day}/${year}`
  }
}

//implementing the TIMER

const startLogoutTimer= function(){
  //set time to five minutes
  let time = 120

  const tick = function(){
    //call the timer every second
    const min = String(Math.trunc(time / 60)).padStart(2,0);
    const sec = String(time % 60).padStart(2,0);
    labelTimer.textContent = `${min}:${sec}`
    //each call print the time to the UI
    //when at 0 seconds, log the user out
    if(time===0){
      clearInterval(timer)
      ///display the UI and message
      labelWelcome.textContent = `Log in to get started`
      containerApp.style.opacity ="0";
    }
      time--;
  }
  tick();
  const timer = setInterval(tick,1000)
  return timer;
}


//code for displaying all the movements in the account as well as code for sorting the movements in ascending order
const printMovements = function(account,sort = false){
  containerMovements.innerHTML = '';

//sorting through the movements code, using the sort method
  const sortedMoves = sort ? account.movements.slice().sort((a,b) =>{
    if(a>b){
      return 1;
    }
    if(b>a){
      return -1;
    }
  }) : account.movements;

  sortedMoves.forEach(function(movement,index){
//partOne: Displaying all the movements of account 1 onto the screen, rendering new html element for each of the values
    const type = movement > 0 ? "deposit" : "withdrawal";
    const date = new Date(account.movementsDates[index])
    const displayDate = formatMovementDate(date)
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${index+1}:  ${type}</div>
        <div class="movements__date">${displayDate}</div>
      <div class="movements__value">$ ${movement.toFixed(2)}</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin',html)
  })
}


//creating the usernames for the bankist app
const makeUserName = function(accs){
  accs.forEach(function(acc){
    acc.userName = acc.owner
    .toLowerCase()
    .split(" ")
    .map(name=>name[0])
    .join("");
  })
}
makeUserName(accounts)

//This is a method to display the balance of the current account onto the screen
const calcBalance = function(account){
   account.balance = account.movements.reduce(function(acc, curr){
     return acc + curr
   },0)
   labelBalance.textContent = `$${account.balance.toFixed(2)}`
}
// calcBalance(account1.movements)

//now we will display the total deposited, total withdrawn and the interestRate
const displaySummary = function(acc){
  const incomes = acc.movements.filter(function(money, index){
    return money > 0
  }).reduce(function(acc,curr,index){
    return acc + curr
  },0)
  labelSumIn.textContent = `$${incomes.toFixed(2)}`

  const withdraws = acc.movements.filter(function(money,index){
    return money < 0;
  }).reduce(function(acc, curr, index){
    return acc + curr
  },0)
  labelSumOut.textContent = `$${withdraws.toFixed(2)}`

  const interest = acc.movements.filter((money,index) => money > 0)
  .map(money=> money * (acc.interestRate/100))
  .filter((int,index) => int >=1)
  .reduce(function(acc,curr){
    return acc + curr;
  },0)
  labelSumInterest.textContent = `$${interest.toFixed(2)}`
}

//diplay UI function
const displayUI = function(acc){
  printMovements(acc)
  //display the current balance
  calcBalance(acc)

  //display summary
  displaySummary(acc)
}


///saving the current user, finding it through the find method
let currentAcount=accounts.find(account => account.userName === inputLoginUsername.value)
let timer;


///implementing the login feature




btnLogin.addEventListener('click',function(event){
  ///this will prevent the form from submitting and wont reload the page
  event.preventDefault()

  currentAcount = accounts.find(account => account.userName === inputLoginUsername.value)

  if(currentAcount?.pin === Number(inputLoginPin.value)){
      ///display the UI and message
      labelWelcome.textContent = `Welcome back ${currentAcount.owner}`
      containerApp.style.opacity ="100";
      const currentDate = new Date();
      labelDate.textContent = `${currentDate.getMonth() +1}/${currentDate.getDate()}/${currentDate.getFullYear()} `

      //checking if there is already a timer running from other users
      if(timer) clearInterval(timer)//if so, then we clear that timer
      timer = startLogoutTimer()// and we set it back to the original 10 minutes for the current user
      ///displayUI
      displayUI(currentAcount)

      //empty the input fields
      inputLoginUsername.value=""
      inputLoginPin.value =""

  }
})
//code for transferring money from one account to another account
btnTransfer.addEventListener('click',function(event){
  event.preventDefault();
  //finding the user who we are sending the money to using the find method
  let transferToUser = accounts.find(account => account.userName === inputTransferTo.value)

  //transfering the funds into their movements array through push method
  let transferAmount = Number(inputTransferAmount.value);

  if(transferAmount > 0 && currentAcount.balance >= transferAmount && transferToUser.userName!==currentAcount.userName){
    transferToUser.movements.push(transferAmount)
    currentAcount.movements.push(-transferAmount)
    //adding transfer date
    currentAcount.movementsDates.push(new Date().toISOString())
    transferToUser.movementsDates.push(new Date().toISOString())
    //reseting the timer after a transfer or a loan
    clearInterval(timer)
    timer = startLogoutTimer()
    displayUI(currentAcount)
  }
  ///emptying the input fields
  inputTransferAmount.value = "";
  inputTransferTo.value= "";
})

///code for requesting a loan from the bank
 btnLoan.addEventListener('click',function(event){
   event.preventDefault();

   const requestAmount = Math.round(Number(inputLoanAmount.value))

   setTimeout( function(){ const approve = currentAcount.movements.some(move=> move > (0.1 * requestAmount))

   if(approve && requestAmount>0){
     currentAcount.movements.push(requestAmount)
     currentAcount.movementsDates.push(new Date().toISOString())
     //reseting the timer after a transfer or a loan
     clearInterval(timer)
     timer = startLogoutTimer()
     displayUI(currentAcount)
     ///add loan date
   }
   },2500)
   inputLoanAmount.value ="";
 })


//code for closing an account (deleting it from the list of accounts we have)
btnClose.addEventListener('click',function(event){
  event.preventDefault()
  if(currentAcount.userName === inputCloseUsername.value &&  currentAcount.pin === Number(inputClosePin.value )){
    const foundIndex = accounts.findIndex(account => account.userName === currentAcount.userName)

    //delete account
    accounts.splice(foundIndex,1)

    //hide UI
    containerApp.style.opacity = "0";
    console.log(accounts);
  }
})
let sortedState = false;
btnSort.addEventListener('click',function(event){
  event.preventDefault();
  printMovements(currentAcount,!sortedState)
  sortedState = !sortedState
})
