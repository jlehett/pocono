# @pocono/func-comp <!-- omit from toc -->

A simple library providing React components that act as utilities for branching logic and conditional rendering.

---

## Table of Contents <!-- omit from toc -->

- [Installation](#installation)
- [Documentation](#documentation)
- [Overview](#overview)
  - [Sample Code](#sample-code)
    - [`Cond` Example](#cond-example)
    - [`If` Example](#if-example)
    - [`Switch` Example](#switch-example)

---

## Installation

```bash
npm install @pocono/func-comp
```

## Documentation

Full documentation can be found at our [Github Wiki](https://github.com/jlehett/pocono/wiki/%40pocono-func-comp).

## Overview

This library provides a set of React components that can be used to create branching logic and conditional rendering in a more declarative way. The components provided are:

- `Cond`: A component that acts as a container for if...else-if...else conditional rendering logic.
- `If`: A component that renders its children if a condition is met.
- `Switch`: A component that acts as a container for switch...case conditional rendering logic.

### Sample Code

#### `Cond` Example

```jsx
import { Cond } from '@pocono/func-comp';

function Example() {
    return (
        <Cond>
            <Cond.If expr={isSignedIn}>
                <p>User is signed in!</p>
            </Cond.If>
            <Cond.ElseIf expr={isLoading}>
                <p>Loading user data...</p>
            </Cond.ElseIf>
            <Cond.Else>
                <p>User is not signed in.</p>
            </Cond.Else>
        </Cond>
    );
}
```

---

#### `If` Example

```jsx
import { If } from '@pocono/func-comp';

function Example() {
    return (
        <If expr={isSignedIn}>
            You are signed in!
        </If>
    );
}
```

---

#### `Switch` Example

```jsx
import { Switch } from '@pocono/func-comp';

function Example() {
    return (
        <Switch expr={username}>
            <Switch.Case value='John' break>
                {/* Rendered if username is 'John' */}
                John
            </Switch.Case>
            <Switch.Case value='Jacob' />
            <Switch.Case value='jacob' break>
                {/* Rendered if username is 'jacob' or 'Jacob' */}
                Jacob
            </Switch.Case>
            <Switch.Default>
                {/* Rendered if username is not 'John', 'Jacob', nor 'jacob' */}
                Other name
            </Switch.Default>
        </Switch>
    );
}
```