const coll = document.getElementsByClassName("btn");
let i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    const expand = this.nextElementSibling;
    if (expand.style.maxHeight){
      expand.style.maxHeight = null;
    } else {
      expand.style.maxHeight = expand.scrollHeight + "px";
    
    } 
  });
}