import { Cond, If, Switch } from './';

describe('Exports', () => {
    it('should export Cond and all of its subcomponents', () => {
        expect(Cond).toBeDefined();
        expect(Cond.If).toBeDefined();
        expect(Cond.ElseIf).toBeDefined();
        expect(Cond.Else).toBeDefined();
    });

    it('should export If', () => {
        expect(If).toBeDefined();
    });

    it('should export Switch and all of its subcomponents', () => {
        expect(Switch).toBeDefined();
        expect(Switch.Case).toBeDefined();
        expect(Switch.Default).toBeDefined();
    });
});
