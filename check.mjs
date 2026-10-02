import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import vm from 'node:vm';

const root = new URL('./', import.meta.url);
const html = await readFile(new URL('index.html', root), 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(ids.length, new Set(ids).size, 'IDs must be unique');
for (const [, id] of html.matchAll(/href="#([^"]+)"/g)) assert(ids.includes(id), `Anchor ${id} must exist`);
assert(!/<style\b|\sstyle=|\son(?:click|load|error)=/i.test(html), 'Keep styles and handlers external');
assert.equal([...html.matchAll(/<link rel="stylesheet"/g)].length, 8);
const expectedMissing = new Set(['assets/images/mascot.png']);
for (const [, ref] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
  if (/^(https?:|#)/.test(ref)) continue;
  try { await access(new URL(ref, root)); }
  catch { assert(expectedMissing.has(ref), `Unexpected missing asset: ${ref}`); }
}

const elements = {};
function element(value = '') {
  return { value, textContent: '', attributes: {}, handlers: {}, validity: { typeMismatch: false },
    addEventListener(event, fn) { this.handlers[event] = fn; },
    setAttribute(name, value) { this.attributes[name] = value; },
    getAttribute(name) { return this.attributes[name]; },
    focus() { this.focused = true; }
  };
}
const form = element();
form.elements = Object.fromEntries(['name', 'email', 'message'].map((field) => [field, element()]));
elements['contact-form'] = form;
elements['form-status'] = element();
for (const field of ['name', 'email', 'message']) elements[`${field}-error`] = element();
const document = { getElementById: (id) => elements[id], addEventListener: (_, fn) => fn() };
vm.runInNewContext(await readFile(new URL('js/contact.js', root), 'utf8'), { document });
const submit = () => form.handlers.submit({ preventDefault() {} });
submit();
assert.equal(form.elements.name.attributes['aria-invalid'], 'true');
assert.equal(form.elements.name.focused, true);
form.elements.name.value = 'Test Visitor';
form.elements.email.value = 'not-an-email';
form.elements.message.value = 'A website enquiry.';
submit();
assert.equal(form.elements.email.attributes['aria-invalid'], 'true');
form.elements.email.value = 'visitor@example.com';
submit();
assert.match(elements['form-status'].textContent, /nothing has been sent/);
assert.equal(form.elements.message.value, 'A website enquiry.');
form.elements.message.value = '   ';
submit();
assert.equal(form.elements.message.attributes['aria-invalid'], 'true');
console.log('PASS: section links, unique IDs, eight CSS files, local assets, and contact validation (empty, invalid, valid, whitespace).');
console.log('Only optional missing media: mascot; the supplied logo is its fallback.');
