#!/usr/bin/env bash
set -eu
set -o pipefail

# check if we are running in a container
function log_hostname() {
  if [ -f /.dockerenv ]; then
    echo "🐳 Running in container $(hostname)"
  else
    echo "👨‍💻 Running on host $(hostname)"
  fi
}

# install deno
function install_deno() {
  # also set later when ~/.exports is linked
  export DENO_DIR="${HOME}/.cache/deno"
  export DENO_INSTALL_ROOT="${HOME}/.deno"
  export PATH="${DENO_INSTALL_ROOT}/bin:${PATH}"

  if ! command -v deno > /dev/null; then
    echo "⏳ Installing Deno..."

    local bash_completion_dir='/etc/bash_completion.d'
    local zsh_site_functions_dir='/usr/local/share/zsh/site-functions'
    local deno_zip='/tmp/deno.zip'

    [ ! -d "$DENO_INSTALL_ROOT" ] && mkdir -p "$DENO_INSTALL_ROOT/bin"
    [ ! -d "$bash_completion_dir" ] && sudo mkdir -p $bash_completion_dir
    [ ! -d "$zsh_site_functions_dir" ] && sudo mkdir -p $zsh_site_functions_dir

    wget -qO "$deno_zip" https://github.com/denoland/deno/releases/latest/download/deno-x86_64-unknown-linux-gnu.zip
    unzip -qod "$DENO_INSTALL_ROOT/bin" "$deno_zip"
    chmod +x "${DENO_INSTALL_ROOT}/bin/deno"
    rm -f "$deno_zip"

    # tab completions
    deno completions bash | sudo tee "${bash_completion_dir}/deno" > /dev/null
    deno completions zsh | sudo tee "${zsh_site_functions_dir}/_deno" > /dev/null

    echo "👍 Deno installed!"
  else
    echo "👍 Deno already installed!"
  fi
}

log_hostname

install_deno

deno run -A main.ts

echo "🎉 Enjoy!"

exit 0
