(function () {
  let btnAddFolder = document.querySelector("#addFolder");
  let btnTextFile = document.querySelector("#addTextFile");
  let divbreadCrumb = document.querySelector("#breadCrumb");
  let aRootPath = divbreadCrumb.querySelector("a[purpose='path']");
  let divContainer = document.querySelector("#container");
  let templates = document.querySelector("#templates");
  let resources = [];
  let cfid = -1;
  let rid = 0;

  btnAddFolder.addEventListener("click", addFolder);
  btnTextFile.addEventListener("click", addTextFile);
  aRootPath.addEventListener("click", viewFolderFromPath);

  function addFolder() {
    let rname = prompt("Enter folder name to be added");
    if (rname != null) {
      rname = rname.trim();
    }
    if (!rname) {
      alert("Empty Folder name is not allowed");
      return;
    }
   
    let alreadyExists = resources.some(r => r.rname == rname && r.pid == cfid);

    if (alreadyExists == true) {
      alert(rname + " folder is already Exists try other Name");
      return;
    }
    rid++;
    let pid = cfid;
    addFolderHTML(rname, rid, pid);
    resources.push({
      rid: rid,
      rname: rname,
      pid: cfid,
      rtype:"folder"
    })
    saveToStorage();

   
  }


  function addFolderHTML(rname, rid, pid) {
     let divFolderTemplate = templates.content.querySelector(".folder");
     let divFolder = document.importNode(divFolderTemplate, true);

     let spanRename = divFolder.querySelector("[action='rename']");
     let spanDelete = divFolder.querySelector("[action='delete']");
     let spanView = divFolder.querySelector("[action='view']");
     let divName = divFolder.querySelector("[purpose='name']");

     spanRename.addEventListener("click", renameFolder);
     spanDelete.addEventListener("click", deleteFolder);
    spanView.addEventListener("click", viewFolder);
    
     divName.innerHTML = rname;
    divFolder.setAttribute("rid", rid);
    divFolder.setAttribute("pid", pid);


    
     divContainer.appendChild(divFolder);
  }

  function addTextFile() {
    let rname = prompt("Enter text file name to be added");
    if (rname != null) {
      rname = rname.trim();
    }
    if (!rname) {
      alert("Empty text name is not allowed");
      return;
    }

    let alreadyExists = resources.some(
      (r) => r.rname == rname && r.pid == cfid
    );

    if (alreadyExists == true) {
      alert(rname + " folder is already Exists try other Name");
      return;
    }
    rid++;
    let pid = cfid;
    addTextFileHTML(rname, rid, pid);
    resources.push({
      rid: rid,
      rname: rname,
      pid: cfid,
      rtype: "text-file",
    });
    saveToStorage();
  }


  function addTextFileHTML(rname , rid, pid) {
     let divTextFileTemplate = templates.content.querySelector(".text-file");
     let divTextFile = document.importNode(divTextFileTemplate, true);

     let spanRename = divTextFile.querySelector("[action='rename']");
     let spanDelete = divTextFile.querySelector("[action='delete']");
     let spanView = divTextFile.querySelector("[action='view']");
     let divName = divTextFile.querySelector("[purpose='name']");

     spanRename.addEventListener("click", renameTextFile);
     spanDelete.addEventListener("click", deleteTextFile);
     spanView.addEventListener("click", viewTextFile);

     divName.innerHTML = rname;
     divTextFile.setAttribute("rid", rid);
     divTextFile.setAttribute("pid", pid);

     divContainer.appendChild(divTextFile);
  }

    function deleteFolder() {
      // delete all folders inside also
      let spanDelete = this;
      let divFolder = spanDelete.parentNode;
      let divName = divFolder.querySelector("[purpose='name']");

      let fidTBD = parseInt(divFolder.getAttribute("rid"));
      let fname = divName.innerHTML;

      let sure = confirm(`Are you sure you want to delete ${fname}?`);
      if (!sure) {
        return;
      }

      // html
      divContainer.removeChild(divFolder);
      // ram
      deleteHelper(fidTBD);

      //  storage
      saveToStorage();
    }

  function deleteHelper(fidTBD) {
    let children = resources.filter((r) => r.pid == fidTBD);
    for (let i = 0; i < children.length; i++) {
      deleteHelper(children[i].rid); // this is capable of delete children and their children recursively
    }

    let ridx = resources.findIndex((r) => r.rid == fidTBD);
    resources.splice(ridx, 1);
  }

  function deleteTextFile() {}

    function renameFolder() {
        let nrname = prompt("Enter folder name to be added");
        if (nrname != null) {
          nrname = nrname.trim();
        }
        if (!nrname) {
          alert("Empty Folder name is not allowed");
          return;
      }
      let spanRename = this;
      let divFolder = spanRename.parentNode;
      let divName = divFolder.querySelector("[purpose=name]");
      let oname = divName.innerHTML;
      let ridTBU = parseInt(divFolder.getAttribute("rid"));
      if (nrname == oname) {
        alert("Please enter the new name");
        return;
      }

      let alreadyExists = resources.some(r => r.rname == nrname && r.pid == cfid);
      if (alreadyExists == true) {
        alert(nrname + "already exists");
        return;
      }
        //change html
      divName.innerHTML = nrname;
      //change ram
      let resource = resources.find(r => r.rid == ridTBU);
      resource.rname = nrname;
       // change storage
      saveToStorage();

    
  }

  function renameTextFile() {}
    function viewFolder() {
      let spanView = this;
      let divFolder = spanView.parentNode;
      let divName = divFolder.querySelector("[purpose='name']");
      let fname = divName.innerHTML;
      let fid = parseInt(divFolder.getAttribute("rid"));

      let aPathTemplate = templates.content.querySelector("a[purpose='path']");
      let aPath = document.importNode(aPathTemplate, true);
      aPath.innerHTML = fname;
      aPath.setAttribute('rid', fid);
      aPath.addEventListener("click", viewFolderFromPath);
      divbreadCrumb.appendChild(aPath);

      cfid = fid;
      divContainer.innerHTML = "";
      for (let i = 0; i < resources.length; i++) {
         if (resources[i].pid == cfid) {
           if (resources[i].rtype == "folder") {
             addFolderHTML(
               resources[i].rname,
               resources[i].rid,
               resources[i].pid
             );
           } else if (resources[i].rtype == "text-file") {
             addTextFileHTML(
               resources[i].rname,
               resources[i].rid,
               resources[i].pid
             );
           }
         }
      }


  }

  function viewFolderFromPath() {
    let aPath = this;
    let fid = parseInt(aPath.getAttribute("rid"));

    while (aPath.nextSibling) {
      aPath.parentNode.removeChild(aPath.nextSibling);
    }
    cfid = fid;
    divContainer.innerHTML = "";
     for (let i = 0; i < resources.length; i++) {
       if (resources[i].pid == cfid) {
         if (resources[i].rtype == "folder") {
           addFolderHTML(
             resources[i].rname,
             resources[i].rid,
             resources[i].pid
           );
         } else if (resources[i].rtype == "text-file") {
           addTextFileHTML(
             resources[i].rname,
             resources[i].rid,
             resources[i].pid
           );
         }
       }
     }
  }

  function viewTextFile() {}
  function saveToStorage() {
    let rjson = JSON.stringify(resources);
    // to convert java script object into string which has to  be saved
    localStorage.setItem("data", rjson);
  }

  function loadFromStorage() {

    let rjson = localStorage.getItem("data");
    if (!rjson) {
      return;
    }
      resources = JSON.parse(rjson);
      for (let i = 0; i < resources.length; i++){
        if (resources[i].pid == cfid) {
          if (resources[i].rtype == "folder") {
            addFolderHTML(resources[i].rname, resources[i].rid, resources[i].pid);
          }else if(resources[i].rtype == "text-file"){
            addTextFileHTML(
              resources[i].rname,
              resources[i].rid,
              resources[i].pid
            );
          }
        }

        if (resources[i].rid > rid) {
          rid = resources[i].rid; 
        }
      }
    
  }
  loadFromStorage();
})();

// IIFE used to prevent to namespace pollution
// 
