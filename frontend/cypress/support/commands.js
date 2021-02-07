// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
// -- This will overwrite an existing command --
Cypress.Commands.add('runBackendCommand', (command) => {
  cy.exec(`docker ps -aqf "name=${Cypress.env('BACKEND_CONTAINER_NAME')}"`)
    .then(({ stdout }) => {
      return stdout.trim();
    })
    .then((backendContainer) => {
      return cy.exec(`docker exec ${backendContainer} python manage.py ${command}`);
    });
});

Cypress.Commands.add('playerJoins', (roomId, playerName) => {
  cy.runBackendCommand(`mock_player_joins ${roomId} ${playerName}`);
});
