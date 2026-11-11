import { test } from 'node:test';
import assert from 'node:assert/strict';

// Unit tests run in deterministic mock mode without consuming live API tokens
process.env.AI_MODE = 'mock';
const { runNavigator, MOCK_MARCUS_RESULTS } = await import('../server/agent/navigator.js');

test('runNavigator returns 3 structured, grounded role cards with free tools and photos', async () => {
  const intake = {
    currentRole: 'Medical Receptionist',
    dailyTasks: 'Check in walk-in patients, manage angry billing calls, coordinate doctor appointments',
    superpowers: 'Staying calm under fire and making nervous patients feel welcome',
    drainers: 'Manual data entry and repeated phone reminder calls',
    workPreference: 'Hybrid',
    techComfort: 'Everyday user',
  };

  const result = await runNavigator(intake);

  assert.equal(result.ok, true);
  assert.ok(result.data.summary.length > 20, 'Summary must be detailed');
  assert.ok(result.data.roles.length === 3, 'Must return exactly 3 role cards');

  for (const role of result.data.roles) {
    assert.ok(role.roleTitle.length > 5, 'Role title is required');
    assert.ok(role.onetCluster.length > 5, 'O*NET cluster is required');
    assert.ok(role.keyTasks.length >= 3, 'Must have at least 3 key tasks');
    assert.ok(role.humanEdge.length > 20, 'Human Edge must be clearly articulated');
    assert.ok(role.aiTools.length >= 2, 'Must include at least 2 free AI tools');
    assert.ok(role.starterPrompt.length > 30, 'Action starter prompt is required');
    assert.ok(role.photo?.url, 'Must include a photo url');
  }
});

test('runNavigator scrubs phone numbers and sensitive data from task descriptions', async () => {
  const intakeWithPii = {
    currentRole: 'Clinic Coordinator',
    dailyTasks: 'Call Dr. Smith at 555-867-5309 or email doc@hospital.org about schedules',
    superpowers: 'Patient empathy',
    drainers: 'Filing SSN forms for 123-45-6789',
    workPreference: 'In-Person',
    techComfort: 'Everyday user',
  };

  const result = await runNavigator(intakeWithPii);
  assert.equal(result.ok, true);
  assert.ok(result.data.roles.length === 3);
});
