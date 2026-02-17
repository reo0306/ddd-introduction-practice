import js from "@eslint/js";
import tseslint from "typescript-eslint";
import * as importPlugin from "eslint-plugin-import";

export default tseslint.config(
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ["**/*.ts"],
        plugins: {
            import: importPlugin,
        },
        settings: {
            "import/resolver": {
                typescript: {},
            },
        },
        rules: {
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    varsIgnorePattern: "^_",
                    argsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                },
           ],

           "import/no-restricted-paths": [
                "error",
                {
                    zones: [
                        {
                            from: "./src/Application/**/*",
                            target: "./src/Domain/**/!(*.spec.ts|*.test.ts)",
                            message:
                                "Application層からDomain層のコードを直接参照することは禁止されています。Domain層のコードはApplication層を通じてアクセスしてください。",
                        },
                        {
                            from: "./src/Presentation/**/*",
                            target: "./src/Domain/**/!(*.spec.ts|*.test.ts)",
                            message:
                                "Presentation層からDomain層のコードを直接参照することは禁止されています。Domain層のコードはApplication層を通じてアクセスしてください。",
                        },
                        {
                            from: "./src/Infrastructure/**/*",
                            target: "./src/Domain/**/!(*.spec.ts|*.test.ts)",
                            message:
                                "Infrastructure層からDomain層のコードを直接参照することは禁止されています。Domain層のコードはApplication層を通じてアクセスしてください。",
                        },
                        {
                            from: "./src/Presentation/**/*",
                            target: "./src/Application/**/!(*.spec.ts|*.test.ts)",
                            message:
                                "Presentation層からApplication層のコードを直接参照することは禁止されています。Application層のコードはPresentation層を通じてアクセスしてください。",
                        },
                        {
                            from: "./src/Infrastructure/**/*",
                            target: "./src/Application/**/!(*.spec.ts|*.test.ts)",
                            message:
                                "Infrastructure層からApplication層のコードを直接参照することは禁止されています。Application層のコードはInfrastructure層を通じてアクセスしてください。",
                        },
                    ],
                },
            ],
        }
    }
);