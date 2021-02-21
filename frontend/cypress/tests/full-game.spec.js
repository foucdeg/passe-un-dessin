describe('Full game', function () {
  it('should run a full game', function () {
    cy.visit('/');

    cy.log('Creating a room...');

    cy.getBySel('start-room').click();
    cy.focused().type('Boss{enter}');
    cy.location('pathname').should('match', /^\/room\/[0-9a-f]+$/);

    cy.location('pathname')
      .then((pathname) => {
        const matches = pathname.match(/^\/room\/([0-9a-f]+)$/);
        return matches[1];
      })
      .as('roomId')
      .then((roomId) => {
        cy.getBySel('room-link');
        cy.playerJoins(roomId, 'Bill');
        cy.playerJoins(roomId, 'Bob');
        cy.playerJoins(roomId, 'Ben');
      });

    cy.log('Checking that everybody joined...');
    cy.getBySel('avatar').contains('Bill').should('exist');
    cy.getBySel('avatar').contains('Bob').should('exist');
    cy.getBySel('avatar').contains('Ben').should('exist');

    cy.getBySel('duration-option').contains('45').click();
    cy.getBySel('controlled-reveal').click();

    cy.log('Starting game...');
    cy.getBySel('start-game').click();

    cy.location('pathname').should(
      'match',
      /^\/room\/([0-9a-f]+)\/game\/([0-9a-f]+)\/step\/([0-9a-f]+)$/,
    );

    cy.location('pathname')
      .then((pathname) => {
        const matches = pathname.match(
          /^\/room\/([0-9a-f]+)\/game\/([0-9a-f]+)\/step\/([0-9a-f]+)$/,
        );
        expect(matches).not.to.be.null;
        return matches[2];
      })
      .as('gameId');

    cy.log('Assert step ordering');
    cy.getBySel('player-order').first().should('contain', 'Boss');
    cy.getBySel('player-order').eq(1).should('contain', 'Boss');
    cy.getBySel('player-order').eq(2).should('not.contain', 'Boss');
    cy.getBySel('player-order').eq(3).should('not.contain', 'Boss');
    cy.getBySel('player-order').eq(4).should('not.contain', 'Boss');

    // First step: dice use
    cy.log('Test typing and using suggestions');
    cy.getBySel('suggestion-dice').click();
    cy.getBySel('suggestion').eq(1).click();
    cy.focused().invoke('val').should('not.be.empty');
    cy.focused().clear();
    // First step: manual entry
    cy.focused().type('A monkey{enter}');
    cy.getBySel('remaining-players').should('have.length', 3);
    cy.getBySel('remaining-players').should('not.contain', 'Boss');

    cy.get('@gameId').then((gameId) => {
      cy.playerSubmitsStep(gameId, 'Bill', 0);
      cy.playerSubmitsStep(gameId, 'Ben', 0);
      cy.playerSubmitsStep(gameId, 'Bob', 0);
    });

    // Second step: drawing
    cy.location('pathname')
      .then((pathname) => {
        const matches = pathname.match(
          /^\/room\/([0-9a-f]+)\/game\/([0-9a-f]+)\/step\/([0-9a-f]+)$/,
        );
        return matches[3];
      })
      .as('stepId');

    cy.getBySel('canvas').drawLine([
      [150, 150],
      [150, 300],
    ]);
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000).then(() => {
      cy.getBySel('canvas').drawLine([
        [350, 150],
        [350, 300],
      ]);
    });
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000).then(() => {
      cy.getBySel('canvas').drawLine([
        [100, 400],
        [200, 450],
        [300, 450],
        [400, 400],
      ]);
    });
    cy.get('@gameId').then((gameId) => {
      cy.playerSubmitsStep(gameId, 'Bill', 1);
      cy.playerSubmitsStep(gameId, 'Ben', 1);
      cy.playerSubmitsStep(gameId, 'Bob', 1);
    });

    // Third step: sentence
    cy.location('pathname')
      .then((pathname) => {
        const matches = pathname.match(
          /^\/room\/([0-9a-f]+)\/game\/([0-9a-f]+)\/step\/([0-9a-f]+)$/,
        );
        return matches[3];
      })
      .as('stepId');

    cy.getBySel('drawing', { timeout: 45000 }).should('be.visible');

    // Try changing our mind
    cy.focused().type('Mr Simpson{enter}');
    cy.getBySel('input-loader').should('exist');
    cy.getBySel('input-loader').should('not.exist');
    cy.getBySel('remaining-players').should('not.contain', 'Boss');
    cy.getBySel('update-sentence').click();
    cy.getBySel('input-loader').should('exist');
    cy.getBySel('input-loader').should('not.exist');
    cy.getBySel('remaining-players').should('contain', 'Boss');
    cy.focused().clear().type('Mr Burns{enter}');
    cy.getBySel('input-loader').should('exist');
    cy.getBySel('input-loader').should('not.exist');
    cy.getBySel('remaining-players').should('not.contain', 'Boss');
  });
});
