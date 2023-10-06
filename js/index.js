// Get references to HTML elements
const searchForm = document.getElementById('github-form');
const searchInput = document.getElementById('search');
const userList = document.getElementById('user-list');
const reposList = document.getElementById('repos-list');

// Event listener for form submission
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear previous search results
    userList.innerHTML = '';
    reposList.innerHTML = '';

    // Get the username entered by the user
    const username = searchInput.value.trim();

    if (username === '') {
        alert('Please enter a GitHub username.');
        return;
    }

    try {
        // Step 1: Search for users using GitHub API
        const userResponse = await fetch(`https://api.github.com/search/users?q=${username}`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!userResponse.ok) {
            throw new Error('GitHub User API request failed.');
        }

        const userData = await userResponse.json();

        // Display user search results
        const users = userData.items;
        users.forEach(user => {
            const userItem = document.createElement('li');
            userItem.innerHTML = `
                <img src="${user.avatar_url}" alt="${user.login}" width="50">
                <a href="${user.html_url}" target="_blank">${user.login}</a>
            `;
            userList.appendChild(userItem);

            // Step 2: Add click event for user items to fetch user repositories
            userItem.addEventListener('click', async () => {
                // Step 3: Fetch user repositories
                const repoResponse = await fetch(`https://api.github.com/users/${user.login}/repos`, {
                    headers: {
                        'Accept': 'application/vnd.github.v3+json'
                    }
                });

                if (!repoResponse.ok) {
                    throw new Error('GitHub Repos API request failed.');
                }

                const repoData = await repoResponse.json();

                // Step 4: Display user repositories
                reposList.innerHTML = '';
                repoData.forEach(repo => {
                    const repoItem = document.createElement('li');
                    repoItem.innerHTML = `
                        <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                    `;
                    reposList.appendChild(repoItem);
                });
            });
        });
    } catch (error) {
        console.error('Error:', error.message);
        userList.innerHTML = 'An error occurred.';
    }
});