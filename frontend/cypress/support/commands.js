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
Cypress.Commands.add('getBySel', (selector, ...args) => {
  return cy.get(`[data-test=${selector}]`, ...args);
});

Cypress.Commands.add('runBackendCommand', (command, options = { timeout: 60000 }) => {
  cy.log(`Running command \`${command}\` against the backend`);
  cy.exec(`docker ps -aqf "name=${Cypress.env('BACKEND_CONTAINER_NAME')}"`, {
    timeout: 60000,
  }).then(({ stdout }) => {
    const backendContainer = stdout.trim();
    return cy.exec(`docker exec ${backendContainer} python manage.py ${command}`, options);
  });
});

Cypress.Commands.add('playerJoins', (roomId, playerName) => {
  cy.runBackendCommand(`mock_player_joins ${roomId} ${playerName}`);
});

Cypress.Commands.add('playerSubmitsStep', (gameId, playerName, roundNumber) => {
  cy.runBackendCommand(`mock_player_submits_step ${gameId} ${playerName} ${roundNumber}`);
});

Cypress.Commands.add('playerVotes', (gameId, playerName) => {
  cy.runBackendCommand(`mock_player_votes ${gameId} ${playerName}`);
});

Cypress.Commands.add('setupDb', () => {
  cy.runBackendCommand(`import_language fr`);
  cy.runBackendCommand(`import_language en`);
  cy.runBackendCommand(`import_language de`);
});

Cypress.Commands.add('drawLine', { prevSubject: true }, (subject, coords) => {
  const elt = subject.get(0);
  const box = elt.getBoundingClientRect();
  elt.dispatchEvent(
    new MouseEvent('mousedown', {
      clientX: box.x + coords[0][0],
      clientY: box.y + coords[0][1],
    }),
  );
  elt.dispatchEvent(
    new MouseEvent('mousemove', {
      clientX: box.x + coords[0][0],
      clientY: box.y + coords[0][1],
    }),
  );
  coords.slice(1).forEach((coordSet, index) => {
    setTimeout(
      () => {
        elt.dispatchEvent(
          new MouseEvent('mousemove', {
            clientX: box.x + coordSet[0],
            clientY: box.y + coordSet[1],
          }),
        );
      },
      (index + 1) * 50,
    );
  });

  setTimeout(() => {
    elt.dispatchEvent(
      new MouseEvent('mouseup', {
        clientX: box.x + coords[coords.length - 1][0],
        clientY: box.y + coords[coords.length - 1][1],
      }),
    );
  }, coords.length * 50);
});

Cypress.Commands.add('clickCanvas', { prevSubject: true }, (subject, coords) => {
  const elt = subject.get(0);
  const box = elt.getBoundingClientRect();
  elt.dispatchEvent(
    new MouseEvent('mousedown', {
      clientX: box.x + coords[0],
      clientY: box.y + coords[1],
    }),
  );
  elt.dispatchEvent(
    new MouseEvent('mouseup', {
      clientX: box.x + coords[0],
      clientY: box.y + coords[1],
    }),
  );
});
