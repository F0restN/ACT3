/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

// prints "hi" in the browser's dev tools console
console.log("Hello INFSCI 2560!");

// You JavaScript here
let db;
let indexedDB =
	window.indexedDB ||
	window.mozIndexedDB ||
	window.webkitIndexedDB ||
	window.msIndexedDB ||
	window.shimIndexedDB;

let request = indexedDB.open("act4IndexedDB", 2);

request.onerror = (event) => {
	console.error("An error occurred with IndexedDB");
	console.error(event);
};

request.onsuccess = () => {
	db = request.result;
};

request.onupgradeneeded = () => {
	const db = request.result;
	const store = db.createObjectStore("user", {
		keyPath: "id",
		autoIncrement: true,
	});
	store.createIndex("by_name", ["name"], { unique: false });
	store.createIndex("by_email", ["email"], { unique: true });
	store.createIndex("by_password", ["password"], { unique: false });

	store.put({
		id: 1,
		email: "yuz211@pitt.edu",
		name: "Drake",
		password: "abccba",
	});
};

// Callback function
function getAllData(callback) {
	// Connection
	const tx = db.transaction("user", "readwrite");

	// Get query reference
	const store = tx.objectStore("user");

	// Query and print
	const idQuery = store.getAll();
	idQuery.onsuccess = () => {
		console.table(idQuery.result);
		callback(idQuery.result);
	};
}

function addData(data) {
	const tx = db.transaction("user", "readwrite");
	const store = tx.objectStore("user");
	console.log(store.autoIncrement);

	const addTransaction = store.add({
		name: data[0][1],
		email: data[1][1],
		password: data[2][1],
	});

	addTransaction.onsuccess = () => {
		window.location.reload();
	};
}

// Interactive

function display_function(data) {
	let displayPanel = document.getElementById("data_display_table");
	data.forEach((item, index) => {
		let node = document.createElement("li");
		let text = document.createTextNode(JSON.stringify(item));
		node.appendChild(text);
		displayPanel.appendChild(node);
	});
}

window.addEventListener("load", function () {
	const tx = db.transaction("user");
	const store = tx.objectStore("user");
	document
		.getElementById("form_input")
		.addEventListener("submit", function (e) {
			e.preventDefault();
			const data = new FormData(e.target);
			const formData = [...data.entries()];
			addData(formData);
		});
});

window.onload = () => {
	getAllData(display_function);
};
