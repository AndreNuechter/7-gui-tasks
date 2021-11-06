describe('Counter', () => {
    beforeEach(() => {
        cy.visit(`localhost:${Cypress.env('PORT')}/counter/`);
    });

    it('starts at 0', () => {
        cy.get('input').should('have.value', '0');
    });

    it('counts one up on button click', () => {
        cy.get('button').click();
        cy.get('input').should('have.value', '1');
    });

    it('displayes a number matching the number of clicks', () => {
        const number = +(Math.ceil(Math.random() * 20));
        const button = cy.get('button');

        for (let i = 0; i < number; i += 1) {
            button.click();
        }

        cy.get('input').should('have.value', number.toString());
    });
});