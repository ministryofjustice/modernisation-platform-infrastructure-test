#!/usr/bin/env bash
# Check if port is open: <address> <port> <timeout-seconds>
#
# usage examples:
#    ./is-port-open.sh 127.0.0.1 80 2
#    ./is-port-open.sh google.com 80 2
# https://superuser.com/questions/621870/test-if-a-port-on-a-remote-system-is-reachable-without-telnet
# The script checks and picks a command that is installed on the system.

timeout_seconds=${3:-1}

if command -v nc &>/dev/null; then
  echo 'Using: nc'
  nc -v -G "${timeout_seconds}" -z -w2 $1 $2
elif command -v curl &>/dev/null; then
  echo 'Using: curl'
  out=$((curl --connect-timeout "${timeout_seconds}" $1:$2 1>&2) 2>&1)
  success_response1='curl: (56) Recv failure: Connection reset by peer'
  if [ -z "${out##*$success_response1*}" ]; then
    echo 'port-is-open'
    exit 0
  fi
  echo "$out"
elif command -v telnet &>/dev/null; then
  echo 'Using: telnet'
  telnet $1 $2
elif [ -e /dev/tcp ]; then
  echo 'Using: /dev/tcp'
  if command -v gtimeout &>/dev/null; then
    gtimeout "${timeout_seconds}s" bash -c "</dev/tcp/${1}/${2} && echo port-is-open || echo port-is-closed" || echo connection-timeout
  elif command -v timeout &>/dev/null; then
    timeout "${timeout_seconds}s" bash -c "</dev/tcp/${1}/${2} && echo port-is-open || echo port-is-closed" || echo connection-timeout
  else
    </dev/tcp/${1}/${2} && echo port-is-open || echo port-is-closed
  fi
fi
