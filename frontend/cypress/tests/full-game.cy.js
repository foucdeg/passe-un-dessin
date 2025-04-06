describe('Full game', function () {
  before(() => {
    cy.setupDb();
  });

  it('should run a full game', function () {
    cy.visit('/');

    // Create a room
    cy.getBySel('start-room').click();
    cy.focused().type('Boss{enter}');
    cy.location('pathname').should('match', /^\/room\/[0-9a-f]+\/$/);

    cy.location('pathname')
      .then((pathname) => {
        const matches = pathname.match(/^\/room\/([0-9a-f]+)\/$/);
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

    // Start the game
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

    cy.getBySel('player-order').first().should('contain', 'Boss');
    cy.getBySel('player-order').eq(1).should('contain', 'Boss');
    cy.getBySel('player-order').eq(2).should('not.contain', 'Boss');
    cy.getBySel('player-order').eq(3).should('not.contain', 'Boss');
    cy.getBySel('player-order').eq(4).should('not.contain', 'Boss');

    // First step: dice use
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

    cy.getBySel('canvas')
      .as('canvas')
      .then(() => {
        cy.get('@canvas').drawLine([
          [150, 150],
          [150, 300],
        ]);

        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(1000).then(() => {
          cy.get('@canvas').drawLine([
            [350, 150],
            [350, 300],
          ]);
        });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(1000).then(() => {
          cy.get('@canvas').drawLine([
            [100, 400],
            [200, 450],
            [300, 450],
            [400, 400],
          ]);
        });
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
    cy.getBySel('remaining-players').should('not.contain', 'Boss');
    cy.getBySel('update-sentence').click();
    cy.getBySel('remaining-players').should('contain', 'Boss');
    cy.focused().clear().type('Mr Burns{enter}');
    cy.getBySel('remaining-players').should('not.contain', 'Boss');

    cy.get('@gameId').then((gameId) => {
      cy.playerSubmitsStep(gameId, 'Bill', 2);
      cy.playerSubmitsStep(gameId, 'Ben', 2);
      cy.playerSubmitsStep(gameId, 'Bob', 2);
    });

    // Fourth step: drawing
    cy.location('pathname')
      .then((pathname) => {
        const matches = pathname.match(
          /^\/room\/([0-9a-f]+)\/game\/([0-9a-f]+)\/step\/([0-9a-f]+)$/,
        );
        return matches[3];
      })
      .as('stepId');

    cy.getBySel('canvas')
      .as('canvas')
      .then(() => {
        cy.get('@canvas').drawLine([
          [150, 150],
          [150, 300],
        ]);
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(1000).then(() => {
          cy.get('@canvas').drawLine([
            [350, 150],
            [350, 300],
          ]);
        });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(1000).then(() => {
          cy.get('@canvas').drawLine([
            [100, 400],
            [200, 450],
            [300, 450],
            [400, 400],
            [100, 400],
          ]);
        });

        // try filling the mouth
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(1000).then(() => {
          cy.getBySel('brush-type-FILL').click();
          cy.getBySel('brush-color-PINK').click();
          cy.get('@canvas').clickCanvas([250, 425]);
        });
      });

    cy.get('@gameId').then((gameId) => {
      cy.playerSubmitsStep(gameId, 'Bill', 3);
      cy.playerSubmitsStep(gameId, 'Ben', 3);
      cy.playerSubmitsStep(gameId, 'Bob', 3);
    });

    // Fifth step: sentence
    cy.location('pathname')
      .then((pathname) => {
        const matches = pathname.match(
          /^\/room\/([0-9a-f]+)\/game\/([0-9a-f]+)\/step\/([0-9a-f]+)$/,
        );
        return matches[3];
      })
      .as('stepId');

    cy.getBySel('drawing', { timeout: 45000 }).should('be.visible');

    cy.focused().type('Still Mr Burns{enter}');
    cy.getBySel('remaining-players').should('not.contain', 'Boss');

    cy.get('@gameId').then((gameId) => {
      cy.playerSubmitsStep(gameId, 'Bill', 4);
      cy.playerSubmitsStep(gameId, 'Ben', 4);
      cy.playerSubmitsStep(gameId, 'Bob', 4);
    });

    // Controlled recap
    cy.location('pathname').should('match', /^\/room\/([0-9a-f]+)\/game\/([0-9a-f]+)\/recap$/);
    cy.getBySel('pad-tab').contains('Boss').click();
    cy.getBySel('drawing').should('have.length', 2).should('be.visible');
    cy.getBySel('pad-tab').contains('Bob').click();
    cy.getBySel('drawing').should('have.length', 2).should('be.visible');
    cy.getBySel('pad-tab').contains('Bill').click();
    cy.getBySel('drawing').should('have.length', 2).should('be.visible');
    cy.getBySel('pad-tab').contains('Ben').click();
    cy.getBySel('drawing').should('have.length', 2).should('be.visible');
    cy.getBySel('start-voting').click();

    // Voting phase
    cy.getBySel('remaining-votes', { timeout: 15000 }).should('have.length', 2); // no idea why so slow
    cy.getBySel('upvote').eq(0).click();
    cy.getBySel('remaining-votes').should('have.length', 1);
    cy.getBySel('pad-tab').eq(1).click();
    cy.getBySel('upvote').eq(0).click();
    cy.getBySel('remaining-votes').should('not.exist');
    cy.getBySel('remaining-players').should('not.contain', 'Boss');

    // Downvote to no longer be done and then upvote
    cy.getBySel('downvote').eq(0).click();
    cy.getBySel('remaining-votes').should('have.length', 1);
    cy.getBySel('remaining-players').should('contain', 'Boss');

    // Vote again
    cy.getBySel('upvote').eq(0).click();
    cy.getBySel('remaining-votes').should('not.exist');
    cy.getBySel('remaining-players').should('not.contain', 'Boss');

    cy.get('@gameId').then((gameId) => {
      cy.playerVotes(gameId, 'Bill');
      cy.playerVotes(gameId, 'Ben');
      cy.playerVotes(gameId, 'Bob');
      cy.playerVotes(gameId, 'Bill');
      cy.playerVotes(gameId, 'Ben');
      cy.playerVotes(gameId, 'Bob');
    });

    // Results
    cy.location('pathname').should(
      'match',
      /^\/room\/([0-9a-f]+)\/game\/([0-9a-f]+)\/vote-results$/,
    );
    cy.getBySel('podium').should('be.visible');
    cy.getBySel('scoreboard').should('be.visible');
    cy.getBySel('ranking-row').should('have.length', 4);

    // Start new game
    cy.getBySel('new-game').click();
    cy.getBySel('new-game-modal').should('be.visible');
    cy.getBySel('start-random').click();
    cy.location('pathname').should(
      'match',
      /^\/room\/([0-9a-f]+)\/game\/([0-9a-f]+)\/step\/([0-9a-f]+)$/,
    );
  });
});
