import { describe, expect, it } from 'vitest';
import { siteUrlProblem } from './site-url-check';

describe('SITE_URL check at server start', () => {
  it('accepts the public https address', () => {
    expect(siteUrlProblem('https://bcc-dev.squared.cloud-power.eu')).toBeUndefined();
    expect(siteUrlProblem('https://www.businesscentercapellen.lu')).toBeUndefined();
  });

  it('flags a missing, local or plain-http address', () => {
    expect(siteUrlProblem(undefined)).toMatch(/not set/);
    expect(siteUrlProblem('http://localhost:3000')).toMatch(/public address/);
    expect(siteUrlProblem('http://bcc.example')).toMatch(/https/);
    expect(siteUrlProblem('bcc.example')).toMatch(/not a valid/);
  });
});
