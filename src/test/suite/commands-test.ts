import assert = require('assert');
import { helloWorld } from '../../commands';

describe('HelloWorld command', () => {
    
    it('HelloWorld command runs without error', async () => {
        try {
            await helloWorld();
        } catch (err) {
            assert.fail(err as Error);
        }
    });
});