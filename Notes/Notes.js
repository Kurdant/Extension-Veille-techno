function Notes (){
    if(document.getElementById("Note")) {
        console.log("cette element existe deja !");
    } else {
        // Ajout de la div
        var newDiv = document.createElement("div");
        var newContent = document.createTextNode("Nouvelle note !");
        newDiv.appendChild(newContent);
        document.body.appendChild(newDiv);
        newDiv.setAttribute('id', 'Note');

        // Ajout du preneur de note
        var newNote = document.createElement("input");
        newDiv.appendChild(newNote)
    }
}