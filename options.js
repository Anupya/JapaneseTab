// Saves options to chrome.storage
function save_options() {
  var romajiCheckVal = document.getElementById('romajiCheck').checked;
  var kanjiModeCheckVal = document.getElementById('kanjiModeCheck').checked;
  chrome.storage.sync.set({
    romajiCheck: romajiCheckVal,
    kanjiModeCheck: kanjiModeCheckVal
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    romajiCheck: true,
    kanjiModeCheck: false
  }, function(items) {
	  document.getElementById('romajiCheck').checked = items.romajiCheck;
	  document.getElementById('kanjiModeCheck').checked = items.kanjiModeCheck;	
    
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);