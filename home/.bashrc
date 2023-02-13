# shellcheck shell=bash
# update window size after each command
shopt -s checkwinsize

# use globs
shopt -s globstar

# don't overwrite the history file
shopt -s histappend

# ignore duplicates and lines starting with space
HISTCONTROL=ignoreboth

# history size
HISTSIZE=500
HISTFILESIZE=5000

# exports, secrets, and aliases
test -f ~/.exports && source ~/.exports
test -f ~/.secrets && source ~/.secrets
test -f ~/.bash_aliases && source ~/.bash_aliases

# set PATH so it includes user's private bin if it exists
test -d "${HOME}/.local/bin" && export PATH="${HOME}/.local/bin:${PATH}"

# completions
for file in /etc/bash_completion.d/* ; do
  test -f "$file" && source "$file"
done

# NVM
unset NVM_DIR
test -d /usr/local/share/nvm && export NVM_DIR='/usr/local/share/nvm'
test -z "$NVM_DIR" && test -d "${HOME}/.nvm" && export NVM_DIR="${HOME}/.nvm"
test -n "$NVM_DIR" && test -f "${NVM_DIR}/nvm.sh" && source "${NVM_DIR}/nvm.sh"

# Zoxide
if command -v zoxide &> /dev/null ; then
  eval "$(zoxide init bash)"
fi

# Liquid Prompt
test -f "${HOME}/.liquidprompt/liquidprompt" && source "${HOME}/.liquidprompt/liquidprompt"
