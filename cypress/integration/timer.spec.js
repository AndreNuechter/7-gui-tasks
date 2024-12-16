describe('Timer', () => {
    beforeEach(() => {
        cy.visit(`localhost:${Cypress.env('PORT')}/timer/`);
    });

    it('starts at 0', () => {
        cy.get('input').should('have.value', '0');
    });
});