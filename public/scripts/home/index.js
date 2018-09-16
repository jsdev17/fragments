(function() {
  // Variable and function declarations inside IIFE
  // do not pollute or leak into global scope (window).

  function getFormDataAsJSON(formId) {
    if (!formId) return;

    let form = document.getElementById(formId);
    let json = {};

    // All input fields must have a unique id.
    for (let i = 0; i < form.elements.length; i++) {
      // This is done to exclude input fields of type
      // submit OR button AND empty form fields.
      if (
        !(form.elements[i].type == "submit" || form.elements[i].type == "button") 
        && form.elements[i].value.trim() !== ""
      )
        json[form.elements[i].id] = form.elements[i].value.trim();
    }

    return json;
  }

  function formatTagsAsArray(json) {
    if (!json["tags"]) return;

    json.tags = json.tags.split(",");
    json.tags = json.tags.map(tag => tag.trim());
  }

  function getFragmentFromForm(formId) {
    let json = getFormDataAsJSON(formId);
    formatTagsAsArray(json);
    return json;
  }

  function clearForm(formId) {
    if (!formId) return;

    let form = document.getElementById(formId);
    for (let j = 0; j < form.elements.length; j++) {
      if (
        !(form.elements[j].type == "submit" || form.elements[j].type == "button") 
        && form.elements[j].value.trim() !== ""
      ) 
        form.elements[j].value = "";
    }
  }
  
  // References to DOM elements to be manipulated.
  const form = document.getElementById("new-fragment-form");
  const discardBtn = document.getElementById("discard-btn");

  // Attachment of event handler functions.
  form.onsubmit = function(e) {
    // Prevent the form from submitting (just yet).
    e.preventDefault();
    // Generate fragment using data from form data fields.
    let fragment = getFragmentFromForm(e.target.id);
    console.log(fragment);

    // Configure settings and set request headers for POST request.
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    let settings = {
      method: "POST",
      headers,
      body: JSON.stringify(fragment)
    };

    // TODO - Determine whether clearForm should be called
    // before or after AJAX request.
    clearForm(e.target.id);

    // TODO - FIGURE OUT WHY FETCH WONT WORK WITH LOCALHOST
    // fetch();
  }

  discardBtn.onclick = function(e) {
    let populatedFieldsCount = 0;

    // Check if there's AT LEAST one populated form field.
    for (let i = 0; i < form.elements.length; i++) {
      // Exclude input fields of type submit OR button.
      if (form.elements[i].type == "submit" || form.elements[i].type == "button")
        continue;
      
      if (form.elements[i].value !== "")
        populatedFieldsCount++;
    }

    // If all fields are empty just return. Otherwise clear form.
    if (populatedFieldsCount == 0) {
      return;
    } else {
      let message = "Are you sure you want to clear everything?";
      // Verify user wants to clear form.
      if ( confirm(message) ) {
        // Clear the thing!
        clearForm(form.id);
      }
    }

  }
})();