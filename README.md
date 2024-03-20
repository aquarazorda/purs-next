# Next.js FFI for PureScript

This project is a Foreign Function Interface (FFI) for using PureScript with Next.js. It allows you to write your Next.js pages and components in PureScript while leveraging the power and simplicity of Next.js.

## Features

- Write your Next.js pages and components in PureScript
- Automatic compilation of PureScript code to JavaScript
- Support for client-side components
- Seamless integration with Next.js file-based routing

## Prerequisites

Before getting started, make sure you have the following installed:

- [Bun](https://bun.sh/) - A fast all-in-one JavaScript runtime
- [PureScript](https://www.purescript.org/) - A strongly-typed functional programming language that compiles to JavaScript

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/next-purescript-ffi.git
   ```

2. Install the dependencies:

   ```bash
   bun install
   ```

3. Compile the PureScript code:

   ```bash
   bun compile
   ```

4. Start the development server:

   ```bash
   bun dev
   ```

5. Open your browser and visit `http://localhost:3000` to see your Next.js app powered by PureScript!

## Creating Pages

To create pages in your Next.js app using PureScript, follow these steps:

1. Create a new `.purs` file in the `src/App` directory, such as `Page.purs` or `Layout.purs`.

2. Write your PureScript code for the page or layout component.

3. The compiler will automatically detect the PureScript files and generate the corresponding JavaScript code in the `app/` directory.

## Using Client Components

If you need to use client-side components in your PureScript code, follow these steps:

1. At the top of your `.purs` file, add the following comment:

   ```purescript
   -- use client
   ```

2. Write your PureScript code for the client-side component.

3. The compiler will handle the necessary setup to enable client-side rendering for that component.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvement, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
