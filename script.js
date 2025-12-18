// Contact form submission
function submitForm(e){
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const item = document.getElementById("item").value;

  if(!name){
    alert("Please enter your name");
    return false;
  }

  alert(`Thank you, ${name}! Your request for "${item}" has been recorded. `);

  e.target.reset();
  return false;
}

// Save feedback to .txt
function saveFile() {
  const text = document.getElementById("note").value;
  const blob = new Blob([text], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "notes.txt";
  link.click();
}

// Load .txt feedback
function loadFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    document.getElementById("note").value = e.target.result;
  };
  reader.readAsText(file);
}

