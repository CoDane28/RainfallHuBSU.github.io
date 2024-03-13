const sign_in_btn = document.querySelector("#sign-in-btn");
const about_btn = document.querySelector("#about-btn");
const container = document.querySelector(".container");

about_btn.addEventListener("click",()=>{
    container.classList.add("about-mode");
});

sign_in_btn.addEventListener("click",()=>{
  container.classList.remove("about-mode");
});
