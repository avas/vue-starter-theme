# Mercury theme SPA file structure

Mercury theme is Vue3 Single-page application. To be more productive during development please, follow the file structure of `client-app` folder given below.

## `components` folder
Since we use [Atomic Design Methodology](https://atomicdesign.bradfrost.com/chapter-2/) we decided to split components on Atoms, Molecules and Organisms. "Stupid" components that haven't any solution-specific logic are located here. If you have any components that need to be shared within your application feel free to create them or modify existing ones to correspond your needs.
How to make a decision where to place components? That's simple.
- **Atoms** are really atomic components. They cannot contain any other components. They may contain pure HTML template and may contain some logic.
- **Molecules** are built from Atoms. So if your component contains one or more atoms - place it right here.
- **Organisms** are the most complex components. They may have one or more molecules inside.

All these components are exported on the root level of `components` subfolder using `index.ts` file. This make them available like this:

```ts
import { ComponentA, ComponentB } from "@/components";
```

Please, consider, that some components have an `_internal` folder inside. These internal components are just a logical division of the main component made to simplify its own code. Such internal components are **not exported** within `index.ts` and **are not available** for independent usage.

### `core/api/graphql` subfolder
We have common [GraphQL](https://graphql.org/) queries and mutations inside this folder. Those queries and mutations are segmented by domain structure.
If you need to modify existing or create additional connectors feel free to do this taking into account the recommended structure.
`types.ts` file is auto generated by `yarn generate:graphql` or `npm run generate:graphql` command and **shouldn't be modified by hand** to avoid possible collisions.

### `core/composables` subfolder
We have a set of common [composables](https://v3.vuejs.org/api/composition-api.html). Those files may contain any logic that is common for the whole application.

### `core/helpers` subfolder
**TBD:** Remove this folder and move containing logic into `core/utilities`.

### `core/utilities` subfolder
This is a right place to put any helpers and utilities and make them available within the whole application.

### `core/constants.ts`
This file contains a set of constants needed to setup your application.
**TBD:** move this logic inside theme-level `config`.

### `pages` subfolder
SPA is a set of pages rendered inside the main entry point during routing.
Place your pages right here, every page within its own folder.
Pages consists of `*.vue`-files containing fetch and display logic. Any page should have a template block to be rendered. Also pages may have `script` block to place some logic like data fetching and page-level state. If you want to setup some page-level styles, place them inside `style` block.
If you need to customize any existing page layout feel free to do it.

### `shared` subfolder