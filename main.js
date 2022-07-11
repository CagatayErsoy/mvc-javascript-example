const Api = (() => {
    const baseUrl = "http://localhost:3000/profile"
    
   

    const getUsers = () =>
        fetch(baseUrl).then(users => users.json())

    const deleteUser=(id)=> 
        fetch([baseUrl,id].join('/'),{
            method: "DELETE",
        })
    const addUser=(user)=>
        fetch((baseUrl),{
            method: "POST",
            body: JSON.stringify(user),
            header:{
                'Content-type': 'application/json; charset=UTF-8',
            }
        }).then((response) => response.json())
    return {
        getUsers,
        deleteUser,
        addUser,
    }
  

})();


//===================View======================================= 
const View = (() => {
    const domstr ={
        container1:"#mvc_container1",
        deleteButton:"deleteButton",
        firstName:"firstName",
        lastName:"lastName",
        email:"email",
        phone:"phone",
        submit:"submit",
       form:"form"
    }
    const render=(element, value)=>{
        element.innerHTML = value

    }
    const createPersonTmp=(obj)=>{


        return `<div>First Name: ${obj.first_name}</div><br>
                <div>Last Name: ${obj.last_name}</div><br>
                <div>Phone Number ${obj.phone}</div><br>
                <div>Email: ${obj.email}</div><br>
            `
        
    }
    const createSection=(arr,callback)=>{
        let section =""
       
        arr.forEach(element=>{
            section+=` <li>
            <span> ${element.id}-${callback(element)} </span>
             <button class="deleteButton" id=${element.id}></button>
            </li>`
           
            
        })
        return section

    }
    return{
        domstr,
        render,
        createSection,
        createPersonTmp,
    }
})()


//===================Model====================================
const Model = ((api,view) => {
    
    class User{
        constructor(firstName, lastName, email,phone){
            this.firstName=firstName,
            this.lastName=lastName,
            this.email=email,
            this.phone=phone
        }
    }
    class State{
        allUsers=[]
    

        get users(){
            
            return this.allUsers
        }
        set users(newUserList){
            this.allUsers=[...newUserList]

            const domElement=document.querySelector(view.domstr.container1)
            const container1=view.createSection(this.allUsers, view.createPersonTmp)
           
            view.render(domElement,container1)
            
          
                
        
            
    

        }
    }

    const { getUsers,addUser,deleteUser } = api;

    return {
        getUsers,
        addUser,
        deleteUser,
        State,
        User,
    };
})(Api,View);


//=================== Controller==========================
const Controller = ((model,view) => {
   const state=new model.State()
   const deleteUser=()=>{
    const userContainer=document.querySelector(view.domstr.container1)
    userContainer.addEventListener('click',(event)=>{
        
        if(event.target.className===view.domstr.deleteButton){
            
            state.users=state.allUsers.filter(user=>
                +user.id!==+event.target.id
            )
            
        }
        model.deleteUser(event.target.id)
    })

   }

   const addUser=()=>{
    const form=document.getElementById(view.domstr.form)
    const submit=document.getElementById(view.domstr.submit)
    const firstName=document.getElementById(view.domstr.firstName)
    const lastName=document.getElementById(view.domstr.lastName)
    const email=document.getElementById(view.domstr.email)
    const phone=document.getElementById(view.domstr.phone)
    submit.addEventListener("click",(e)=>{
        
        e.preventDefault()
        const newUser=new model.User(firstName.value, lastName.value ,email.value, phone.value)
        console.log(newUser)
         model.addUser(newUser
         
         ).then(user=>{
            console.log("this is user",user)
         state.users=[user,...state.allUsers]
     })
       
       // reset part
       
        

    })

        
   }
   
   
    const init = () => {
       
       
        model.getUsers().then(users=>{
           
          state.users=[...users].reverse()
        
           
        }

            
        )
    }

    const bootstrap =()=>{
        init(),
        deleteUser()
        addUser()
    }

    return {
        bootstrap,
    }
})(Model, View)
Controller.bootstrap ()


