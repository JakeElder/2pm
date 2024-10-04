---
to: <%= dir %>/<%= id %>/tsconfig.json
---
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "module": "esnext",
    "strict": true,
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
