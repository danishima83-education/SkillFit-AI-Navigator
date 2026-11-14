import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ChatRequest, NewResource, NavigateRequest, NavigatorOutput, firstError } from '../server/validation.js';

test('chat requests need a message', () => {
  assert.equal(ChatRequest.safeParse({ message: '   ' }).success, false);
  assert.equal(ChatRequest.safeParse({ message: 'hi', skill: 'auto' }).success, true);
  assert.equal(ChatRequest.safeParse({ message: 'hi', skill: '../../etc' }).success, false);
});

test('new resources are checked with friendly messages', () => {
  const bad = NewResource.safeParse({ name: 'X', category: 'Pizza', description: 'short' });
  assert.equal(bad.success, false);
  assert.match(firstError(bad), /Name is required/);
  const wrongCategory = NewResource.safeParse({ name: 'Good Place', category: 'Pizza', description: 'A real description' });
  assert.match(firstError(wrongCategory), /Category must be one of/);
  const good = NewResource.safeParse({ name: 'Good Place', category: 'Food', description: 'Free meals on Fridays', website: '' });
  assert.equal(good.success, true);
  assert.equal(good.data.languages, 'English');
  const badSite = NewResource.safeParse({ name: 'Good Place', category: 'Food', description: 'Free meals on Fridays', website: 'example.com' });
  assert.equal(firstError(badSite), 'Website must start with http:// or https://');
  assert.equal(NewResource.safeParse({ name: 'Ab', category: 'Food', description: 'Free meals' , website: 'https://example.org/x' }).success, true);
});

test('ticket 002 examples give the exact messages', () => {
  const base = { name: 'Good Place', category: 'Food', description: 'Free meals on Fridays' };
  assert.equal(firstError(NewResource.safeParse({ ...base, name: 'A' })), 'Name is required.');
  assert.equal(firstError(NewResource.safeParse({ ...base, description: 'abc' })), 'Add a short description.');
});

test('navigate requests validate Marcus frontline intake fields', () => {
  const validPayload = {
    currentRole: 'Medical Receptionist',
    dailyTasks: 'Check in patients, handle scheduling and billing disputes',
    superpowers: 'De-escalating angry patients',
    drainers: 'Manual data entry',
    workPreference: 'Hybrid',
    techComfort: 'Everyday user',
  };
  assert.equal(NavigateRequest.safeParse(validPayload).success, true);

  const missingTasks = { ...validPayload, dailyTasks: ' ' };
  assert.equal(NavigateRequest.safeParse(missingTasks).success, false);
  assert.match(firstError(NavigateRequest.safeParse(missingTasks)), /daily tasks/);

  const emptyRole = { ...validPayload, currentRole: '' };
  assert.equal(NavigateRequest.safeParse(emptyRole).success, false);
  assert.match(firstError(NavigateRequest.safeParse(emptyRole)), /current or past role/);
});

test('navigate requests allow optional superpowers/drainers and validate LLM output schema', () => {
  const minimal = NavigateRequest.safeParse({
    currentRole: 'Cashier',
    dailyTasks: 'Handle register transactions and customer returns',
  });
  assert.equal(minimal.success, true);
  assert.equal(minimal.data.superpowers, '');
  assert.equal(minimal.data.drainers, '');

  const badLlmOutput = NavigatorOutput.safeParse({
    summary: 'Valid summary text here.',
    roles: [{ roleTitle: 'Test', summary: 'Missing keyTasks and humanEdge' }],
  });
  assert.equal(badLlmOutput.success, false);
});
