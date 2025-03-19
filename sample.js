let table=document.querySelector('#table tbody');
let form=document.querySelector('form');
let span = document.querySelectorAll('span');
let names=document.getElementById('name'),
email=document.getElementById('email'),
username=document.getElementById('username');
let submit=document.getElementById('submit-btn');
let check=true
let obj={};
let editId;
let xhr=new XMLHttpRequest()
let url=`https://mimic-server-api.vercel.app/users/`

function getValues(){
    
    xhr.open('GET',url)
    xhr.onload=()=>{
        JSON.parse(xhr.response).forEach(x=>{
            userValues(x)
        })
    }
    xhr.send()
}
getValues()

function userValues(obj){
    let tr = document.createElement('tr');
    tr.innerHTML = ` <td>${obj.id}</td>
        <td>${obj.name}</td>
        <td>${obj.email}</td>
        <td>${obj.username}</td>
        <button class="edit" id=${obj.id}>EDIT</button>
        <button class="delete" id=${obj.id}>DELETE</button>`
    table.append(tr)
}

function formOpen(){
    document.getElementById("userForm").style.display = "block";
}

submit.addEventListener('click',(e)=>{
e.preventDefault();
inputValidation(names,email,username)
if(submit.textContent=="Edit"){
    inputValidation(names,email,username)
}
})

function inputValidation(name, mail, username) {
    let checkmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.(com|in)$/.test(mail.value);
    if (name.value.length < 5) { return span[0].textContent = "Name length is short"; } else { span[0].textContent = "" }
    if (!checkmail) { return span[1].textContent = "Invalid email format"; } else { span[1].textContent = "" }
    if (username.value.length < 6) { return span[2].textContent = "Invalid username length"; } else { span[2].textContent = "" }
    obj={name:name.value,email:mail.value,username:username.value}
    if(submit.textContent!=="Edit"){
        api('Post',`${url}`)
    }
    else if(submit.textContent=="Edit"){
        api('Put',`${url}${editId}`)
    }
}

function api(name,url){
    xhr.open(name,url)
    xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8')

if(name=="Post"){
    xhr.send(JSON.stringify(obj));alert('Submitted successfully');getValues();
}
else if(name=="Put"){ 
    obj={name:names.value,email:email.value,username:username.value}
    xhr.responseType="json"
    xhr.send(JSON.stringify(obj));alert('Edited successfully');
    submit.textContent="Submit"
}
}
table.addEventListener('click',(e)=>{
    if(e.target.classList.contains('edit')){
        document.getElementById("userForm").style.display = "block";
        showingDetails(e.target.id)
    }
    else if(e.target.classList.contains('delete')){
        deletevalues(e.target.id)
    }
})

function showingDetails(id){
    editId=id
    xhr.open('GET',`https://mimic-server-api.vercel.app/users/${id}`)
    xhr.responseType='json';
    xhr.onload=()=>{  
        names.value=xhr.response.name;
        email.value=xhr.response.email;
        username.value=xhr.response.username;
    }
    xhr.send()
    submit.textContent="Edit"
}
function deletevalues(id){
    let dele=new XMLHttpRequest();
    dele.open('Delete',`https://mimic-server-api.vercel.app/users/${id}`)
    dele.send()
    getValues();
}