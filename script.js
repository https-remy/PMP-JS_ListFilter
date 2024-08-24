let dataArray;

async function getUsers() {
	await fetch('https://randomuser.me/api/?nat=fr&results=50')
		.then(response => {
			if (!response.ok) {
				throw new Error('Error fetching data');
			}
			return response.json();
		})
		.then(data => {
			orderList(data.results);
			dataArray = data.results;
			createUserList(dataArray);
		})
		.catch(error => {
			console.error('Error fetching data:', error);
		});
}

getUsers();

function orderList(data) {
	data.sort((a, b) => {
		if (a.name.last < b.name.last) return -1;
		else if (a.name.last > b.name.last) return 1;
		else return 0;
	});
}

const tableResults = document.querySelector('.table-results');

function createUserList(sortedData) {
	sortedData.forEach(user => {
		const listItem = document.createElement('li');
		listItem.className = 'table-item';
		listItem.innerHTML = `
			<p class="main-info">
				<img src="${user.picture.thumbnail}" alt="avatar">
				<span> ${user.name.last} ${user.name.first}</span>
			</p>
			<p class="email">${user.email}</p>
			<p class="phone">${user.phone}</p>
		`
		tableResults.appendChild(listItem);
	});
}

const searchInput = document.querySelector('#search');

searchInput.addEventListener('input', filterUsers);

function filterUsers(e) {
	tableResults.innerHTML = '';
	const searchValue = e.target.value.toLowerCase().replace(/\s/g, '');
	const filteredUsers = dataArray.filter(user => searchOccurencies(user, searchValue));
	createUserList(filteredUsers);
}

function searchOccurencies(user, searchValue) {
	const searchTypes = {
		firstName: user.name.first.toLowerCase(),
		lastName: user.name.last.toLowerCase(),
		firstAndLast: `${user.name.first + user.name.last}`.toLowerCase(),
		lastAndFirst: `${user.name.last + user.name.first}`.toLowerCase(),
	}

	for (const type in searchTypes) {
		if (searchTypes[type].includes(searchValue)) {
			return true;
		}
	}
	return false;
}