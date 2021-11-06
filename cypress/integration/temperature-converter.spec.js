const testCases = [
    { c: '0', f: '32' },
    { c: '-17.8', f: '0' },
    { c: '10', f: '50' },
    { c: '42', f: '107.6' },
    { c: '-10', f: '14' },
    { c: '100', f: '212' },
    { c: '30', f: '86' }
];

describe('Temperature converter', () => {
    beforeEach(() => {
        cy.visit(`localhost:${Cypress.env('PORT')}/temperature-converter/`);
    });

    it('Fields start out empty', () => {
        const inputs = cy.get('input');
        inputs.first().should('have.value', '');
        inputs.last().should('have.value', '');
    });

    it('Numerical inputs in a field, lead to changes in the other', () => {
        cy.get('input').first().type('123');
        cy.get('input').last().invoke('val').should('not.be.empty');
        cy.get('input').last().type('123');
        cy.get('input').first().invoke('val').then(val => expect(val).to.not.eq('123'));
    });

    it('Gives correct results for test-data', () => {
        function checkTestcases(enteredUnit, calculatedUnit) {
            testCases.forEach(testCase => {
                cy.get('input')[enteredUnit === 'f' ? 'last' : 'first']()
                    .clear()
                    .type(testCase[enteredUnit]);
                cy.get('input')[calculatedUnit === 'f' ? 'last' : 'first']()
                    .invoke('val')
                    .then(val => expect(val).to.eq(testCase[calculatedUnit]));
            });
        }

        let enteredUnit = Math.random() > 0.5 ? 'c' : 'f';
        let calculatedUnit = enteredUnit === 'c' ? 'f' : 'c';

        checkTestcases(enteredUnit, calculatedUnit);
        checkTestcases(calculatedUnit, enteredUnit);
    });
});