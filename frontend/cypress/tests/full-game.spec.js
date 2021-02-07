describe('Full game', () => {
  it('should run a full game', () => {
    let roomId = null;
    let gameId = null;

    cy.visit('/');
    cy.get('[data-test=start-room]').click();
    cy.focused().type('Boss{enter}');
    cy.location('pathname').should('match', /^\/room\/[0-9a-f]+$/);

    cy.location('pathname').then((pathname) => {
      roomId = pathname.match(/^\/room\/([0-9a-f]+)$/)[1];
      cy.playerJoins(roomId, 'Bill');
      cy.playerJoins(roomId, 'Bob');
      cy.playerJoins(roomId, 'Ben');
    });

    cy.get('[data-test=avatar]').contains('Bill').should('exist');
    cy.get('[data-test=avatar]').contains('Bob').should('exist');
    cy.get('[data-test=avatar]').contains('Ben').should('exist');

    cy.get('[data-test=controlled-reveal]').click();

    cy.get('[data-test=start-game]').click();

    cy.location('pathname').should(
      'match',
      /^\/room\/([0-9a-f]+)\/game\/([0-9a-f]+)\/step\/([0-9a-f]+)$/,
    );

    cy.location('pathname').then((pathname) => {
      const matches = pathname.match(/^\/room\/([0-9a-f]+)\/game\/([0-9a-f]+)\/step\/([0-9a-f]+)$/);
      expect(matches).not.to.be.null;
      gameId = matches[2];
      cy.log('gameId', gameId);
    });

    cy.get('[data-test=player-order]').first().should('contain', 'Boss');
    cy.get('[data-test=player-order]').eq(1).should('contain', 'Boss');
    cy.get('[data-test=player-order]').eq(2).should('not.contain', 'Boss');
    cy.get('[data-test=player-order]').eq(3).should('not.contain', 'Boss');
    cy.get('[data-test=player-order]').eq(4).should('not.contain', 'Boss');

    cy.get('[data-test=suggestion-dice]').click();
    cy.get('[data-test=suggestion]').eq(1).click();
    cy.focused().invoke('val').should('not.be.empty');
    cy.focused().clear();
    cy.focused().type('A monkey{enter}');
  });
});
