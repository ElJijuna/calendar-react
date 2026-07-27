# Security Policy

## Supported versions

| Version | Supported |
| --- | --- |
| 0.x (latest minor) | ✅ |
| older 0.x | ❌ |

While the package is pre-1.0, only the latest minor receives fixes.

## Reporting a vulnerability

Report privately through [GitHub Security Advisories](https://github.com/ElJijuna/calendar-react/security/advisories/new). Please do not open a public issue for a vulnerability.

Include the affected version, a description of the impact, and a reproduction if you have one. You can expect an initial response within 7 days, and a fix or a mitigation plan within 30 days for confirmed issues.

## Scope

`temporal-calendar-react` is a client-side UI library with **no runtime dependencies** and no network access. The most likely classes of issue are:

- Untrusted values injected into the DOM through `getDayParts` or custom `heading` / label content.
- Denial of service from unbounded props (e.g. an extreme `months` or `maxYears`).

Anything requiring the consumer to render attacker-controlled React nodes is generally out of scope — sanitize such content before passing it in.
