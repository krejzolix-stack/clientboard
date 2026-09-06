const form = document.getElementById('clientForm');
const nameInput = document.getElementById('nameInput');
const emailInput = document.getElementById('emailInput');
const statusInput = document.getElementById('statusInput');
const noteInput = document.getElementById('noteInput');
const searchInput = document.getElementById('searchInput');
const filterInput = document.getElementById('filterInput');
const clientList = document.getElementById('clientList');
const emptyState = document.getElementById('emptyState');
const clientCount = document.getElementById('clientCount');

const storageKey = 'clientboard_clients';
let clients = loadClients();

function loadClients() {
	try {
		const savedClients = JSON.parse(localStorage.getItem(storageKey));
		return Array.isArray(savedClients) ? savedClients : [];
	} catch {
		return [];
	}
}

function saveClients() {
	localStorage.setItem(storageKey, JSON.stringify(clients));
}

function getStatusClass(status) {
	if (status === 'Nowy') return 'status-new';
	if (status === 'W trakcie') return 'status-progress';
	return 'status-done';
}

function deleteClient(id) {
	clients = clients.filter((client) => client.id !== id);
	saveClients();
	render();
}

function getVisibleClients() {
	const search = searchInput.value.trim().toLowerCase();
	const filter = filterInput.value;

	return clients.filter((client) => {
		const name = String(client.name || '').toLowerCase();
		const email = String(client.email || '').toLowerCase();
		const matchesSearch = name.includes(search) || email.includes(search);
		const matchesFilter = filter === 'all' || client.status === filter;
		return matchesSearch && matchesFilter;
	});
}

function render() {
	clientList.innerHTML = '';
	const visibleClients = getVisibleClients().slice().reverse();
	clientCount.textContent = clients.length;
	emptyState.style.display = visibleClients.length === 0 ? 'block' : 'none';

	visibleClients.forEach((client) => {
		const row = document.createElement('div');
		row.className = 'client-row';

		const name = document.createElement('div');
		name.className = 'client-name';
		name.textContent = client.name;

		const email = document.createElement('div');
		email.className = 'client-email';
		email.textContent = client.email;

		const status = document.createElement('span');
		status.className = `status ${getStatusClass(client.status)}`;
		status.textContent = client.status;

		const note = document.createElement('div');
		note.className = 'client-note';
		note.textContent = client.note || 'Brak notatki';

		const deleteButton = document.createElement('button');
		deleteButton.className = 'delete-button';
		deleteButton.type = 'button';
		deleteButton.textContent = 'Usuń';
		deleteButton.addEventListener('click', () => deleteClient(client.id));

		row.append(name, email, status, note, deleteButton);
		clientList.appendChild(row);
	});
}

form.addEventListener('submit', (event) => {
	event.preventDefault();

	const name = nameInput.value.trim();
	const email = emailInput.value.trim();
	if (!name || !email) return;

	clients.push({
		id: Date.now(),
		name,
		email,
		status: statusInput.value,
		note: noteInput.value.trim()
	});

	saveClients();
	render();
	form.reset();
	statusInput.value = 'Nowy';
	nameInput.focus();
});

searchInput.addEventListener('input', render);
filterInput.addEventListener('change', render);

render();
