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
  cy.log(`Running command \`${command}\` against the backend`);
  cy.exec(`docker ps -aqf "name=${Cypress.env('BACKEND_CONTAINER_NAME')}"`, { log: false }).then(
    ({ stdout }) => {
      const backendContainer = stdout.trim();
      return cy.exec(`docker exec ${backendContainer} python manage.py ${command}`, { log: false });
    },
  );
});

Cypress.Commands.add('playerJoins', (roomId, playerName) => {
  cy.runBackendCommand(`mock_player_joins ${roomId} ${playerName}`);
});
