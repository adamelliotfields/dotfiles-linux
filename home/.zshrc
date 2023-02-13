# shellcheck shell=zsh
# ignore duplicates and lines starting with space
setopt HIST_IGNORE_ALL_DUPS
setopt HIST_IGNORE_SPACE

# don't overwrite the history file
setopt APPEND_HISTORY

# history size
HISTSIZE=500
SAVEHIST=5000

# customize how the end of partial lines are shown
PROMPT_EOL_MARK=''

# exports, secrets, and aliases
[[ -f "${HOME}/.exports" ]] && source "${HOME}/.exports"
[[ -f "${HOME}/.secrets" ]] && source "${HOME}/.secrets"
[[ -f "${HOME}/.bash_aliases" ]] && source "${HOME}/.bash_aliases"

# set PATH so it includes user's private bin if it exists
[[ -d "${HOME}/.local/bin" ]] && export PATH="${HOME}/.local/bin:${PATH}"

# zsh functions
[[ $+functions[compdef] -eq 0 ]] && autoload -Uz compinit; compinit
[[ $+functions[complete] -eq 0 ]] && autoload -Uz bashcompinit; bashcompinit
[[ $+functions[prompt] -eq 0 ]] && autoload -Uz promptinit; promptinit

# NVM
unset NVM_DIR
[[ -d /usr/local/share/nvm ]] && export NVM_DIR='/usr/local/share/nvm'
[[ -z "$NVM_DIR" && -d "${HOME}/.nvm" ]] && export NVM_DIR="${HOME}/.nvm"
[[ -n "$NVM_DIR" && -f "${NVM_DIR}/nvm.sh" ]] && source "${NVM_DIR}/nvm.sh"

# Zoxide
if command -v zoxide &> /dev/null ; then
  eval "$(zoxide init zsh)"
fi

# Liquid Prompt
[[ -f "${HOME}/.liquidprompt/liquidprompt" ]] && source "${HOME}/.liquidprompt/liquidprompt"
