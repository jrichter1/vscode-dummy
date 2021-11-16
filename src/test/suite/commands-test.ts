import assert = require('assert');
import { helloWorld } from '../../commands';
import { window } from 'vscode';
import * as sinon from 'sinon';

describe('HelloWorld command', () => {
    let sandbox: sinon.SinonSandbox;

    before(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('HelloWorld command runs without error', async () => {
        const stub = sandbox.stub(window, 'showInformationMessage').resolves();
        try {
            await helloWorld();
        } catch (err) {
            assert.fail(err as Error);
        } finally {
            assert(stub.callCount === 1);
        }
    });
});