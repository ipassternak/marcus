# Marcus

Marcus is a Command Line Interface (CLI) application for compiling and manipulating Markdown files effortlessly.

- [Revert commit](https://github.com/ipassternak/marcus/commit/e11c4fe8039b4ec07641d65f0d07108240203f1b)
- [Failed commit](https://github.com/ipassternak/marcus/commit/33c9ff908fd7e06ad0ab37e1892d06b7ddc7a9b2)

## Conclusion

Підсумовуючи, тестування є невід'ємною частиною розробки програмного забезпечення. Вони допомагають прискорити написання нового функціоналу та захистити працездатність старого.

Покриття коду тестами допомогло мені виявити кілька багів та легко впровадити розширений функціонал. Не менш важливим для мене є `TDD` (Test-Driven Development), яке спонукає розробника краще моделювати архітектуру системи, використовувати загальноприйняті техніки, практики та принципи, якими в іншому випадку часто нехтується. Це прискорює та полегшує розробку системи, забезпечує гладке горизонтальне масштабування.

Натомість `TDD` має й негативні властивості, які зумовлені основною концепцією такого підходу. Контракти та інтерфейси модулів, що тестуються, мають властивість змінюватися у процесі розробки. Це відбувається через різноманітні причини, проте має однаковий негативний наслідок. При зміні інтерфейса модуля, ми змушені змінити й функцію, що його тестує, а це в свою чергу суперечить ідеї `TDD`, де всі тести повинні бути виключно _immutable_ й незалежити від модуля, що тестується, забезпечуючи правильну перевірку його функціональності.

## Table of Contents

- [Getting Started](#getting-started)
  - [Requirements](#requirements)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Help](#help)
  - [Alternative Startup](#alternative-startup)
- [Testing](#testing)
- [Features](#features)
- [Usage Examples](#usage-examples)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

### Requirements:

To use Marcus, ensure you have the following dependencies installed on your system:

- [Node.js](https://nodejs.org/en) (version 16 or later)
- [npm](https://www.npmjs.com/) or any other Node package manager
- A shell environment for running scripts

### Installation:

To install Marcus, simply clone this repository and install the dependencies using npm:

```shell
git clone https://github.com/ipassternak/marcus.git
cd marcus
npm install
```

## Usage:

After installation, you can run Marcus using the following command:

```shell
node index.js <input>
```

Replace `<input>` with the path to the Markdown file you want to compile or manipulate.

## Help:

For a list of all available commands and options, you can use the following command:

```shell
node index.js --help
```

## Alternative Startup:

To make Marcus easily accessible from any directory in your system, you can add its directory to your `PATH` environment variable and make the `marcus` script executable:

```shell
export PATH="$PATH:/path/to/marcus"
sudo chmod u+x ./marcus # -- in project root directory
```

Then, you can use the `marcus` command directly:

```shell
marcus <input>
```

## Features
- Markdown Compilation: Marcus can compile Markdown files into various formats such as HTML.

## Usage Examples

Here are some examples of how you can use Marcus in your workflow:

1. Compile a Markdown file to HTML output result to `stdout`:
    ```shell
    marcus document.md
    ```
2. Compile a Markdown file to HTML and save result as a file:
   ```shell
   marcus document.md --out /path/to/save
   ```

## Testing

To run the tests for this project, execute the following command in your terminal:

```shell
npm test
```

For development, it's recommended to use the interactive version with the following command:

```shell
npm run test:dev
```

## Contributing

Contributions to Marcus are welcome! If you have any suggestions, bug reports, or feature requests, please open an issue or submit a pull request on [GitHub](https://github.com/ipassternak/marcus).

## License

This project is licensed under the [MIT License](LICENSE).
