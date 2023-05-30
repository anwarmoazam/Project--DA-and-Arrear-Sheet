const nameDOM = document.getElementById('name');
const salaryDOM = document.getElementById('salary');
const dateDOM = document.getElementById('date');
const btnDOM = document.getElementById('submit');

btnDOM.addEventListener('click',function(event){
    event.preventDefault();
    console.log('Name : ',nameDOM.value);
    console.log('Basic Salary : ',salaryDOM.value);
    console.log('Date : ',dateDOM.value);

})
