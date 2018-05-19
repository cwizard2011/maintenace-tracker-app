const col = document.getElementsByClassName("sort-btn");
let i;

for (i = 0; i < col.length; i++) {
  col[i].addEventListener("click", function() {
    this.classList.toggle("activate");
    const open = this.nextElementSibling;
    if (open.style.maxHeight){
      open.style.maxHeight = null;
    } else {
      open.style.maxHeight = open.scrollHeight + "px";
    } 
  });
}