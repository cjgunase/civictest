---
trigger: model_decision
description: user interface related decitions should consult this rule file
---

# UI Elements Rule

We use shadcn/ui for all UI elements in this project.

1. **If shadcn/ui is not initialized in our project,** use the following command:
   ```bash
   npx shadcn@latest init
   ```

2. **If a particular component is not installed,** use the following command (for example, to install the button component):
   ```bash
   npx shadcn@latest add button
   ```

---
title: Next.js
description: Install and configure shadcn/ui for Next.js.
---

<Callout className="mb-6 border-emerald-600 bg-emerald-100 dark:border-emerald-400 dark:bg-emerald-900">

**Starting a new project?** Use [shadcn/create](/create) for a fully configured Next.js app with custom themes, Base UI or Radix, and icon libraries.

</Callout>

<Steps>

### Create Project

Run the `init` command to create a new Next.js project or to setup an existing one:

```bash
npx shadcn@latest init -t next
```

**For a monorepo project, use `--monorepo` flag:**

```bash
npx shadcn@latest init -t next --monorepo
```

### Add Components

You can now start adding components to your project.

```bash
npx shadcn@latest add button
```

The command above will add the `Button` component to your project. You can then import it like this:

```tsx {1,6} showLineNumbers title="app/page.tsx"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div>
      <Button>Click me</Button>
    </div>
  )
}
```

</Steps>
