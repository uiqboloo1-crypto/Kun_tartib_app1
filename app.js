function render() {
  tasksList.innerHTML = "";
  let q = search.value.toLowerCase();
  let list = tasks.filter(t => t.title.toLowerCase().includes(q));

  const now = new Date();
  if(filter.value==="today") {
    list = list.filter(t => t.datetime && new Date(t.datetime).toDateString()===now.toDateString());
  } else if(filter.value==="tomorrow") {
    let tom = new Date(); tom.setDate(now.getDate()+1);
    list = list.filter(t => t.datetime && new Date(t.datetime).toDateString()===tom.toDateString());
  } else if(filter.value==="overdue") {
    list = list.filter(t => t.datetime && new Date(t.datetime)<now && !t.done);
  } else if(filter.value==="completed") {
    list = list.filter(t => t.done);
  }

  if(sort.value==="time") list.sort((a,b)=>(a.datetime||"").localeCompare(b.datetime||""));
  if(sort.value==="priority") list.sort((a,b)=>a.priority.localeCompare(b.priority));
  if(sort.value==="title") list.sort((a,b)=>a.title.localeCompare(b.title));

  list.forEach(t=>{
    const node = taskTpl.content.cloneNode(true);
    const art = node.querySelector(".task");
    art.dataset.priority = t.priority;
    if(t.done) art.classList.add("completed");
    art.dataset.id = t.id;
    node.querySelector(".taskTitle").textContent = t.title;
    node.querySelector(".taskMeta").innerHTML = `<i class="fa-regular fa-clock"></i> ${formatDate(t.datetime)} | <i class="fa-solid fa-flag"></i> ${t.priority}`;
    node.querySelector(".taskNotes").textContent = t.notes;

    node.querySelector(".doneChk").checked = t.done;
    node.querySelector(".doneChk").onchange=()=>{t.done=!t.done; save(); render();};
    node.querySelector(".deleteBtn").onclick=()=>{tasks=tasks.filter(x=>x.id!==t.id); save(); render();};
    node.querySelector(".editBtn").onclick=()=>{
      document.getElementById("title").value=t.title;
      document.getElementById("datetime").value=t.datetime;
      document.getElementById("priority").value=t.priority;
      document.getElementById("notes").value=t.notes;
      newTaskSection.hidden=false;
      taskForm.onsubmit=(e)=>{
        e.preventDefault();
        t.title=document.getElementById("title").value;
        t.datetime=document.getElementById("datetime").value;
        t.priority=document.getElementById("priority").value;
        t.notes=document.getElementById("notes").value;
        save(); render();
        newTaskSection.hidden=true;
        taskForm.reset();
      };
    };
    tasksList.appendChild(node);
  });
}
