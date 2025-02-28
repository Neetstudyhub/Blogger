import { storage } from "./firebase-config.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-storage.js";

document.getElementById("uploadForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const fileInput = document.getElementById("pdfFile");
  const file = fileInput.files[0];
  if (!file) {
    alert("Please select a file");
    return;
  }

  const storageRef = ref(storage, "pdfs/" + file.name);
  uploadBytes(storageRef, file)
    .then(snapshot => getDownloadURL(snapshot.ref))
    .then(url => {
      alert("File uploaded successfully! Download Link: " + url);
    })
    .catch(error => console.error("Error uploading file:", error));
});
