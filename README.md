# dotfiles-linux

My dotfiles and install script for Linux development environments.

## Usage

Clone the repo wherever you clone repos and run install:

```bash
gh repo clone adamelliotfields/dotfiles-linux
cd dotfiles-linux
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

## Notes

### Git

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

### Secrets

Put secrets in `~/.secrets`. Things like [`GH_TOKEN`](https://cli.github.com/manual/gh_help_environment) and [`DENO_DEPLOY_TOKEN`](https://deno.com/deploy/docs/deployctl).

```bash
cat << EOF | tee ~/.secrets > /dev/null
export GH_TOKEN=ghp_your_token
export GITHUB_TOKEN="$GH_TOKEN"
export DENO_DEPLOY_TOKEN=ddp_your_token
EOF
```
