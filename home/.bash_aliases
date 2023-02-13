# shellcheck shell=sh
alias ..='cd ..'
alias ...='cd ../..'

alias c='clear'
alias d='diskus'
alias v='vim'
alias octal='stat -f "%a"'
alias rmf='rm -f'
alias rmrf='rm -rf'
alias uuid='uuidgen'
alias python='python3'

# Make xclip behave like pbcopy/pbpaste on Mac
alias pbcopy='xclip -selection clipboard'
alias pbpaste='xclip -selection clipboard -o'

# Lsd aliases
alias l='lsd -lA' # like `ls -la`, but ignores . and ..
alias ld='lsd -lA --total-size' # shows directory size (expensive)

# Fd aliases
# Use globs all the time
alias f='fd --glob' # pass --regex to go back to default RegEx mode
alias fr='fd --regex'
alias fH='fd --glob -H' # show hidden files
alias fI='fd --glob -I' # show ignored files
alias fu='fd --glob --unrestricted' # equivalent of `fd -H -I`
alias ff='fd --glob --type=file' # find files
alias fl='fd --glob --type=symlink' # find symlinks
alias fx='fd --glob --type=executable' # find executables
alias fdd='fd --glob --type=directory' # find directories
alias fddp='fd --glob --type=directory --prune' # don't traverse into matching diretories
alias fddpI='fd --glob --type=directory --prune -I' # usage: fddpI $glob [$dir=pwd]

# Git aliases
alias g='git'
alias ga='git add'
alias gaa='git add --update' # add ALL tracked files (ignores new files) (99% of the time you want this)
alias gb='git branch'
alias gba='git branch --all' # list ALL local and remote branches
alias gbd='git branch --delete' # delete a branch
alias gbD='git branch -D' # force delete a branch
alias gc='git commit' # opens your $EDITOR for message
alias gcm='git commit --message' # enter message after command, e.g., gcm 'initial commit'
alias gca='git commit --all' # stage and commit all tracked files (ignores new files)
alias gcam='git commit --all --message'
alias gce='git commit --allow-empty' # for kicking off a new ci job
alias gcem='git commit --allow-empty --message'
alias gco='git checkout'
alias gd='git diff'
alias gdt='git difftool'
alias gf='git fetch'
alias gfo='git fetch origin'
alias gi='git init'
alias gl='git log'
alias glp='git log -p' # paginated log, shows diffs colored by delta (the program `delta`)
alias glg='git log --graph --pretty="%Cred%h%Creset -%C(auto)%d%Creset %s %Cgreen(%ar) %C(bold blue)<%an>%Creset"'
alias glo='git log --oneline'
alias gm='git merge'
alias gmt='git mergetool'
alias gp='git push'
alias gpo='git push origin'
alias gpuo='git push -u origin'
alias gpl='git pull'
alias gplo='git pull origin'
alias gr='git reset --' # use this one to reset staged files
alias grs='git restore --' # use this one to restore a changed file
alias gs='git stash'
alias gsd='git stash drop'
alias gsp='git stash pop'
alias gsl='git stash list'
alias gslp='git stash list -p'
alias gss='git stash show'
alias gssp='git stash show -p'
alias gstat='git status'
alias gsw='git switch' # use this one to switch to a different branch
alias gswc='git switch -c' # use this one to create a new branch and switch to it

# Git Extras
alias gu='git undo' # git reset --soft HEAD~1 (undoes the last commit but leaves files staged)
alias gus='git undo -s' # git undo; git reset (undoes the last commit and unstages all files)
alias gsum='git summary' # see `man git-summary`

# GitHub CLI
alias ghr='gh repo'
alias ghrc='gh repo create' # interactive create, will prompt for inputs
alias ghrcl='gh repo clone' # prefer this over git clone because you can use org/repo format
alias ghrv='gh repo view --web' # same as git browse from git-extras

# NPM
alias n='npm'
alias nC='npm -C'
alias ni='npm install --save-prod'
alias nie='npm install --save-prod --save-exact'
alias nid='npm install --save-dev'
alias nide='npm install --save-dev --save-exact'
alias nio='npm install --save-optional'
alias nioe='npm install --save-optional --save-exact'
alias nig='npm install --global'
alias nige='npm install --global --save-exact'
alias nr='npm run'
alias nrb='npm run build'
alias nrd='npm run dev'
alias nrl='npm run lint'
alias nrs='npm run start'
alias nrt='npm run test'
alias ndeps='cat package.json | jq .dependencies'
alias nddeps='cat package.json | jq .devDependencies'
alias nodeps='cat package.json | jq .optionalDependencies'
alias nscripts='cat package.json | jq .scripts'
alias nengines='cat package.json | jq .engines'
