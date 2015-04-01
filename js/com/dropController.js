dropController = (function(){

	var acceptDrop = function(event) {
		event.preventDefault();
	    var data = event.dataTransfer.getData("text");
	    console.log("data:"+data)

	    var event = new CustomEvent('ITEM_ADDED', { 'detail': data });

		// Dispatch the event.
		dispatchEvent(event);
	}

	var allowDrop = function(event) {
		event.preventDefault();
	}

	var startDrag = function(event) {
		event.dataTransfer.setData('text', event.target.id);
	}

	return {
		acceptDrop:acceptDrop,
		allowDrop:allowDrop,
		startDrag:startDrag,
		ITEM_ADDED:"ITEM_ADDED"
	}
}())