const toast = document.querySelector(".toast");

//creating toastmessage
const createToast = (msg, color="red") => {
  const div = document.createElement("div");
  div.innerHTML = msg;
  div.style.backgroundColor = color;
  toast.insertAdjacentElement("beforeend", div);
  setTimeout(() => {
    div.remove();
  }, 5000);
};
const registerUser=async (e)=>{
    e.preventDefault();
    const name=document.querySelector("#username");
    const email=document.querySelector("#email");
    const password=document.querySelector("#password");
    const expense = {
        name: name.value,
        email: email.value,
        password: password.value,
      };
      try {
        const response =await  axios.post(
          "http://localhost:5000/user/signup",
          expense
        );
        alert(response.data.msg)
        createToast(response.data.msg,'green');
        window.location.href = "./login.html";
    // name.value = "";
    // email.value = "";
    // password.value="";
      }
    catch(error){
      //console.log(error.response.data);
        console.log(error);
        if(error.response.status==400){
          createToast(error.response.data.msg);
        } else if (error.response.status == 500) {
          createToast(error.response.data.msg);
        } else {
          console.log(error)
    }
  }
}
