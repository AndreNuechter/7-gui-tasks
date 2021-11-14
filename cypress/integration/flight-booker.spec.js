describe('Counter', () => {
    beforeEach(() => {
        cy.visit(`localhost:${Cypress.env('PORT')}/flight-booker/`);
    });

    it('contains a select with the correct values', () => {
        cy.get('select option[value="one-way flight"]').should('be.visible');
        cy.get('select option[value="return flight"]').should('be.visible');
    });

    it('the option "one-way flight" is pre-selected', () => {
        cy.get('select').invoke('val').then(val => expect(val).to.eq('one-way flight'));
    });

    it('initially the two date-inputs have the same value', () => {
        cy.get('input[type="date"]').first().invoke('val').then(valOne => {
            cy.get('input[type="date"]').last().invoke('val').then(valTwo => expect(valOne).to.eq(valTwo));
        });
    });

    it('the second date-input is only enabled when the option "return flight" is selected', () => {
        cy.get('input[type="date"]').last().should('be.disabled');
        cy.get('select').select('return flight');
        cy.get('input[type="date"]').last().should('not.be.disabled');
    });

    it('the button becomes disabled when the return is before the departure', () => {
        cy.get('button').should('not.be.disabled');
        cy.get('select').select('return flight');
        cy.get('input[type="date"]').first().type('2021-01-01');
        // NOTE: if we dont trigger change manually the test fails
        // perhaps related to https://github.com/cypress-io/cypress/issues/1171
        cy.get('input[type="date"]').last().type('2020-01-01').trigger('change');
        cy.get('button').should('be.disabled');
        cy.get('input[type="date"]').first().type('2020-01-01');
        cy.get('input[type="date"]').last().type('2021-01-01');
        cy.get('button').should('not.be.disabled');
    });

    it('pressing the "book" button displays an appropriate message', () => {
        const stub = cy.stub();
        cy.on('window:alert', stub);
        cy.get('input[type="date"]').first().type('2021-01-01');
        cy.get('button').click()
            .then(() => {
                expect(stub.getCall(0)).to.be.calledWith('Your flight is on the 2021-01-01.');
            });
    });
});