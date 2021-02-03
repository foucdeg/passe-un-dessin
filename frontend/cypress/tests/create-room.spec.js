describe('Player creation', () => {
  it('should create a player when launching game', () => {
    cy.visit('/');
    cy.get('[data-test=start-room]').click();
    cy.focused().type('Boss{enter}');
    cy.location('pathname').should('match', /^\/room\/[0-9a-f]+$/);

    cy.location('pathname').then((pathname) => {
      const roomId = pathname.match(/^\/room\/([0-9a-f]+)$/)[1];
      cy.playerJoins(roomId, 'Bill');
      cy.playerJoins(roomId, 'Bob');
      cy.playerJoins(roomId, 'Ben');
    });

    cy.get('[data-test=avatar]').contains('Bill').should('exist');
    cy.get('[data-test=avatar]').contains('Bob').should('exist');
    cy.get('[data-test=avatar]').contains('Ben').should('exist');
  });
});
