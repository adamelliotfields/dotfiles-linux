# dotfiles

My personal dotfiles manager written in Deno.

## Features

- [x] Installs Deno (if not already installed)
- [x] Installs NVM (if not already installed)
- [x] Installs [Liquid Prompt](https://github.com/nojhan/liquidprompt)
- [x] Installs [a bunch of useful packages](./config.yml)
- [x] Symlinks [my dotfiles](./public/)
- [x] Written in Deno 🦕

## Usage

Clone the repo wherever you clone repos and run install:

```bash
gh repo clone adamelliotfields/dotfiles
cd dotfiles
./install.sh
source ~/.zshrc
```

If you want to take it for a test drive in a container:

```bash
# you can also run `deno task docker` if you have deno
bash -c $(cat deno.jsonc | jq -r .tasks.docker)
./install.sh
source ~/.zshrc
```

## Git

I use a `.gitconfig.inc` file for personal information. This file is included by `~/.gitconfig`:

```bash
cat << EOF | tee ~/.gitconfig.inc > /dev/null
[user]
  name = Your Name
  email = mail@example.com
  signingkey = last_16_chars_of_gpg_key_id
[commit]
  gpgsign = true
[gpg]
  program = /usr/bin/gpg
EOF
```

## Secrets

Put secrets in `~/.secrets`. [GitHub Token](https://cli.github.com/manual/gh_help_environment) bare mins:

```bash
cat << EOF | tee ~/.secrets > /dev/null
export GH_TOKEN=ghp_your_token
export GITHUB_TOKEN="$GH_TOKEN"
EOF
```

## VS Code

I use [Settings Sync](https://code.visualstudio.com/docs/editor/settings-sync).

## Walkthrough

The Deno app looks like this:

```
.
|-- components
|-- public
|-- utils
|-- config.yml
|-- deno.jsonc
|-- import_map.json
`-- main.ts
```

- [`components`](./components/) are the modules that do the actual work. Each is just an object with a `run` method.
- [`public`](./public/) is where the actual dotfiles that get symlinked to `$HOME` are found.
- [`utils`](./utils/) are helper functions used throughout the app.
- [`config.yml`](./config.yml) allows some configuration over which prompts and packages are installed.
- [`deno.jsonc`](./deno.jsonc) tells Deno to use [`import_map.json`](./import_map.json).
- [`main.ts`](./main.ts) is the entrypoint of the application.

## Notes

In the future I plan on decoupling the app from my dotfiles so it can be used on Linux and Mac.

When that happens, I'll drop the YAML config in favor of [`std/flags`](https://deno.land/std/flags/mod.ts) to parse command line arguments.
